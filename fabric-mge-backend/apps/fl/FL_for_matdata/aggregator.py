# The implementation is referenced from the following repository:
# https://github.com/lishenghui/blades
import torch
import numpy as np


class Aggregator:
    def __init__(self, method: str) -> None:
        self.method = method
    
    def __call__(self, epoch_info_dict: dict):
        method_name = f"_{self.method}"
        method = getattr(self, method_name, None)
        if method is None:
            raise ValueError(f"Method {self.method} is not defined")
        all_params = [v for v in epoch_info_dict.values()]
        all_params = torch.tensor(all_params, dtype=torch.float32)
        return method(all_params).tolist()

    @staticmethod
    def _clip(v: torch.Tensor, tau: float):
        v_norm = torch.norm(v)
        scale = min(1, tau / v_norm)
        return v * scale
    
    @staticmethod
    def _pairwise_euclidean_distances(vectors):
        """Compute the pairwise euclidean distance.

        Arguments:
            vectors {list} -- A list of vectors.

        Returns:
            dict -- A dict of dict of distances {i:{j:distance}}
        """
        n = len(vectors)
        vectors = [v.flatten() for v in vectors]

        distances = {}
        for i in range(n - 1):
            distances[i] = {}
            for j in range(i + 1, n):
                distances[i][j] = ((vectors[i] - vectors[j]).norm()) ** 2
        return distances
    
    @staticmethod
    def _geometric_median_objective(median, points, alphas):
        return sum(
            [
                alpha * ((median - p).norm() ** 2)
                for alpha, p in zip(alphas, points)
            ]
        )
    
    @staticmethod
    def _multi_krum_selection(distances, n, f, m):
        """Multi_Krum algorithm.

        Arguments:
            distances {dict} -- A dict of dict of distance. distances[i][j] = dist.
            i, j starts with 0.
            n {int} -- Total number of workers.
            f {int} -- Total number of excluded workers.
            m {int} -- Number of workers for aggregation.

        Returns:
            list -- A list indices of worker indices for aggregation. length <= m
        """
        def _compute_scores(distances, i, n, f):
            """Compute scores for node i.

            Args:
                distances {dict} -- A dict of dict of distance. distances[i][j] = dist.
                i, j starts with 0.
                i {int} -- index of worker, starting from 0.
                n {int} -- total number of workers
                f {int} -- Total number of excluded workers.

            Returns:
                float -- krum distance score of i.
            """
            s = [distances[j][i] ** 2 for j in range(i)] + [
                distances[i][j] ** 2 for j in range(i + 1, n)
            ]
            _s = sorted(s)[: n - f - 2]
            return sum(_s)
        if n < 1:
            raise ValueError(
                "Number of workers should be positive integer. Got {}.".format(f)
            )

        if m < 1 or m > n:
            raise ValueError(
                "Number of workers for aggregation should be >=1 and <= {}. Got {}.".format(
                    m, n
                )
            )

        if 2 * f + 2 > n:
            raise ValueError("Too many excluded workers: 2 * {} + 2 >= {}.".format(f, n))

        for i in range(n - 1):
            for j in range(i + 1, n):
                if distances[i][j] < 0:
                    raise ValueError(
                        "The distance between node {} and {} should be non-negative: "
                        "Got {}.".format(i, j, distances[i][j])
                    )

        scores = [(i, _compute_scores(distances, i, n, f)) for i in range(n)]
        sorted_scores = sorted(scores, key=lambda x: x[1])
        return list(map(lambda x: x[0], sorted_scores))[:m]
    
    def _mean(self, params: torch.Tensor):
        return params.mean(dim=0)

    def _median(self, params: torch.Tensor):
        values_upper, _ = params.median(dim=0)
        values_lower, _ = (-params).median(dim=0)
        res = (values_upper - values_lower) / 2
        return res
    
    def _multi_krum(
        self,
        params: torch.Tensor,
        num_excluded: int = 0,
        num_aggregation: int = 1,
    ):
        distances = self._pairwise_euclidean_distances(params)
        top_m_indices = self._multi_krum_selection(
            distances, len(params), num_excluded, num_aggregation
        )
        values = torch.stack(
            [params[i] for i in top_m_indices], dim=0
        ).mean(dim=0)
        return values

    def _centered_clipping(
        self,
        params: torch.Tensor,
        tau: float = 10.0,
        n_iter: int = 5,
        momentum=None,
    ):
        if momentum is None:
            momentum = torch.zeros_like(params[0])
        for _ in range(n_iter):
            momentum = (
                sum(self._clip(v - momentum, tau) for v in params) / len(params)
                + momentum
            )

        return torch.clone(momentum)

    def _geo_med(
        self,
        params: torch.Tensor,
        maxiter: int = 100,
        eps: float = 1e-6,
        ftol: float = 1e-10,
        weights=None,
    ):
        if weights is None:
            weights = np.ones(len(params)) / len(params)
        median = params.mean(dim=0)
        num_oracle_calls = 1
        obj_val = self._geometric_median_objective(median, params, weights)
        for i in range(maxiter):
            _, prev_obj_val = median, obj_val
            weights = np.asarray(
                [
                    max(
                        eps,
                        alpha
                        / max(eps, (median - p).norm().item()),
                    )
                    for alpha, p in zip(weights, params)
                ],
                dtype=weights.dtype,
            )
            weights = weights / weights.sum()
            median = torch.sum(
                torch.vstack([w * beta for w, beta in zip(params, weights)]),
                dim=0,
            )
            num_oracle_calls += 1
            obj_val = self._geometric_median_objective(median, params, weights)
            if abs(prev_obj_val - obj_val) < ftol * obj_val:
                break

        return median

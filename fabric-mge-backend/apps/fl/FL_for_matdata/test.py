epoch_info_dict = {
            1: [1, 2, 3],
            2: [4, 5, 6],
            3: [2, 3, 4],
        }
sums = [0] * len(next(iter(epoch_info_dict.values())))

for key, values in epoch_info_dict.items():
    sums = [x + y for x, y in zip(sums, values)]

averages = [x / len(epoch_info_dict) for x in sums]

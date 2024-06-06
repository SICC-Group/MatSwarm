import Urls from '../Urls';
import { RestListFetch2,JsonApiFetch } from '../Fetch';
import { ReviewState } from '../define/ReviewState';

export interface DoiReviewItem {
    id: number;
    title: string;
    contributor: string;
    project: string;
    status: number;
    data_ids: number[];
    applicant: string;
    add_time: string;
    dataset_id: number;
    dataset_title: string;
}

export async function DoiReviewList(reviewState: ReviewState, page: number) {
    const url = Urls.api_v3_storage.review_doi_list;
    if (reviewState === ReviewState.All) {
        return RestListFetch2<DoiReviewItem>(url, 'GET', { page: page, private: true });
    }
    else {
        return RestListFetch2<DoiReviewItem>(url, 'GET', { page: page, state: reviewState,  private: true });
    }
}

export async function DoiReview(success:number[], failed:number[]) {
    const url =Urls.api_v1_storage.doi_review;
    return JsonApiFetch<any>(url,'PATCH',{
        success,
        failed
    })
}
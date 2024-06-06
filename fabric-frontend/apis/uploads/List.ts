import Urls from '../Urls';
import { RestListFetch } from '../Fetch';
import { ReviewState } from '../define/ReviewState';
import { UploadHistory } from '../define/Upload';

export type ItemType = UploadHistory;

export async function ListUploadHistory(reviewState: ReviewState, page: number = 1, real_name: string = '', subject: string = '') {
    const url = Urls.api_v3_storage.upload_list;
    if (reviewState === ReviewState.All) {
        return RestListFetch<ItemType>(url, 'GET', { page: page, real_name:real_name, subject:subject });
    }
    else {
        return RestListFetch<ItemType>(url, 'GET', { page: page, review_state: reviewState, real_name:real_name, subject:subject });
    }
}

// import { JsonApiFetch } from '../../Fetch';
// import Urls from '../../Urls';
// import { ReviewState } from '../../define/ReviewState';

// export interface UploadHistory {
//     upload_id: number;
//     data_count: number;
//     state: ReviewState;
//     uploader: string;
//     reviewer: string;
//     uploaded_via: 'file' | 'web_form',
//     upload_time: string;
//     file_url?: string;
    
//     disapprove_reason?: string;
// }

// interface Result {
//     total: number;
//     list: UploadHistory[];
//     page_size: number;
// }

// export async function GetReviewDataList(reviewState: ReviewState, page = 1): Promise<Result> {
//     let url = '';
//     if (reviewState === ReviewState.All) {
//         url = `${Urls.api_v1_storage.get_data_list}?page=${page}`;
//     }
//     else {
//         url = `${Urls.api_v1_storage.get_data_list}?page=${page}&status=${reviewState}`;
//     }
//     const result = await JsonApiFetch<Result>(url);
//     for(let i of result.list) {
//         let stateNum: number = i.state as any;
//         switch(stateNum) {
//         case 0: i.state = ReviewState.Pending; break;
//         case 1: i.state = ReviewState.Approved; break;
//         case 2: i.state = ReviewState.Disapproved; break;
//         }
//     }
//     return result;
// }

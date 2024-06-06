import {ReviewState} from '../define/ReviewState';
import {UploadHistory} from '../define/Upload';
import {RestApiFetch, JsonApiFetch} from '../Fetch';
import Urls from '../Urls';

export type Result = UploadHistory.Full;

export async function GetUploadHistory(uploadID: number): Promise<Result> {
    return RestApiFetch(Urls.api_v3_storage.upload_detail(uploadID));
}

// 新版上传历史页面API 获取上传历史记录
export function GetUploadHistoryList(state: ReviewState, page ?: number, pagesize ?: number){
  const url = Urls.api_v3_storage.account_upload_history;
  let review_state = state;
  if (state === 'all') { review_state = -1;}
  return RestApiFetch(url + '?review_state=' + review_state + '&page=' + page + '&page_size=' + pagesize);
}

// 新版上传历史页面API 获取某条上传历史记录下的所有数据，按页返回
export function GetUploadHistoryData(history_id: number, page ?: number, pageSize ?: number) {
  let url = Urls.api_v2_storage.get_history_data(history_id);
  if (page != null && pageSize != null) { url = url + '?page=' + page + '&page_size=' + pageSize  }
  return RestApiFetch(url, 'GET' );
}

// 获取某条上传历史记录下的所有数据，只返回数据id
export function GetUploadHistoryData1(history_id: number, meta_id_only ?: boolean) {
  let url = Urls.api_v2_storage.get_history_data(history_id);
  return RestApiFetch(url + '?meta_id_only=' + meta_id_only, 'GET' );
}

//公开指定上传历史下的数据
export function ModifyPubdate(history_id:number,public_date:string,public_range:string){
  let url = Urls.api_v3_storage.modify_pubdate;
  return JsonApiFetch(url,'POST',{
    history_id:history_id,
    public_date:public_date,
    public_range:public_range

  })
}

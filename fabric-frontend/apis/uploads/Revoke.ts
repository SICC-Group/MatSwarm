import {JsonApiFetch, JsondataApiFetch} from '../Fetch';
import Urls from '../Urls';

// 新版上传历史界面 撤回指定上传历史
export function RevokeUploadHistory(id: number){
  const url = Urls.api_v1_storage.retract_data(id);
  return JsonApiFetch(url, 'DELETE');
}

// 新版上传历史界面 撤回大科学装置数据
export function RevokeUploadHistory1(id: number[]){
  const url = Urls.api_v2_storage.review_data_refuse;
  const data: { reprotId: string; msg: string; state: string; }[] = [];
  id.map( item => {
    data.push({
        reprotId: String(item),
        msg: '数据信息不完整',
        state: '-2',
    })
  })
  return JsondataApiFetch(url, 'POST', data);
}

// 新版上传历史界面 撤回高通量计算数据
export function RevokeData_cache(id: number){
  const url = Urls.api_v2_storage.data_withdraw;
   return JsondataApiFetch(url + '?data_id=' + id, 'DELETE');
}

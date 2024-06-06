import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export function StateToFinished(state: number){
  return state === 3 || state === 4 || state === 5;
}

export interface Verification {
  id: string;
  ps_id: string;
  name: string;
  leader: string;
  create_time: string;
  state: number;
  cert_key: string;
  finished ?: boolean;
}

export function GetVerificationList(page: number, page_size: number, state: number) {
  const url = Urls.api_cert.get_verification_list;
  const my = 1; // 防止用户是评价组长的话看不到自己的汇交验收申请
  if (state === -1) { // 获取全部状态
  return JsonApiFetch(url + '?page=' + page + '&page_size=' + page_size + '&my=' + my, 'GET');
  }
  else { return JsonApiFetch(url + '?page=' + page + '&page_size=' + page_size + '&state=' + state + '&my=' + my, 'GET'); }
}

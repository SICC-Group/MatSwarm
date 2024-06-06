import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

interface Params {
  is_project: boolean;
  ps_id: string;
}

// 申请汇交证明
export function ApplyCertificationApi(params: Params){
  const url = Urls.api_cert.apply_certification;
  return JsonApiFetch(url, 'POST', params);

}

// 申请汇交验收
export function ApplyVerificationApi(params: Params){
  const url = Urls.api_cert.apply_verification;
  return JsonApiFetch(url, 'POST', params);
}

export function GetGroupLeaders(){
  const url = Urls.api_cert.get_group_leaders;
  // const url = 'http://mged.nmdms.ustb.edu.cn/api/cert/groupleaders';
  return JsonApiFetch(url, 'GET');
}

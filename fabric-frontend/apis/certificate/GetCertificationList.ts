import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export interface Certification {
 ps_id: string;
  issue_time: string;
  expired: boolean;
  expired_time: string;
  is_project: boolean;
  key: string;
}

export interface Result {
  page: number;
  page_size: number;
  // total: number;
  data: Certification[];
}

export function GetCertificationList(page: number, page_size: number){
  const url = Urls.api_cert.get_certification_list;
  return JsonApiFetch(url + '?page=' + page + '&page_size=' + page_size, 'GET');
}

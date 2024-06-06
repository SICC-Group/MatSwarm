import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export function GetCertificate(cert_key: string){
  const url = Urls.api_cert.get_certificate(cert_key);
   return JsonApiFetch(url, 'GET');
}

export function DownloadData(cert_key: string, tid: string, random: number){
  const url = Urls.api_cert.download_data(cert_key)
  return JsonApiFetch(url + '?tid=' + tid + '&random=' + random);
}

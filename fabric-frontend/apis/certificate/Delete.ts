import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export function DeleteVerification(acceptance_id: string){
  const url = Urls.api_cert.delete_verification(acceptance_id);
  return JsonApiFetch(url , 'DELETE');
}

import { JsonApiFetch } from '../Fetch';
import Urls from '../Urls';

export default async function Logout() {
  return JsonApiFetch<void>(Urls.api_v1_account.session_api, 'DELETE');
}

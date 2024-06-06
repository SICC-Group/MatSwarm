import { JsonApiFetch, NotFeedback_JsonApiFetch } from '../Fetch';
import Urls from '../Urls';
import { UserInfo } from '../define/User';

export async function Info() {
  return NotFeedback_JsonApiFetch<UserInfo>(Urls.api_v1_account.user_info);
}

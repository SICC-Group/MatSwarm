import JsonApiFetch from '../Fetch';
import Urls from '../Urls';
import { UserInfo } from '../define/User';

export async function GetUser(id: string) {
    return JsonApiFetch<UserInfo>(Urls.api_v1_account.user_resource(id));
}
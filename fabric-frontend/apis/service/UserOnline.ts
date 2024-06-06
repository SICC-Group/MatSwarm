import { JsonApiFetch } from '../Fetch';
import Urls from '../Urls';

interface UserOnlineRet {
    counts: number;
}

export async function UserOnline() {
    const result =  await JsonApiFetch<UserOnlineRet>(Urls.api_v1_service.online_user_counts);
    return result.counts;
}

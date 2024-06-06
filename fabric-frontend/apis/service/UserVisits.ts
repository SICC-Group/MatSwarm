import { JsonApiFetch } from '../Fetch';
import Urls from '../Urls';

interface UserVisitsRet {
    counts: number;
}

export async function UserVisits() {
    const result =  await JsonApiFetch<UserVisitsRet>(Urls.api_v1_service.user_visits);
    return result.counts;
}
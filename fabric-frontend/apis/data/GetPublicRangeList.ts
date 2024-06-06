import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
// import { Project } from '../define/Project';

export async function GetPublicRangeList(): Promise<any[]> {
    let publicRangeList = JsonApiFetch(Urls.api_v3_storage.get_public_range);
    console.log(publicRangeList);
    return publicRangeList;
}
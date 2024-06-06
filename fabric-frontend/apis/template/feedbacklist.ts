import Urls from '../Urls';
import {Feedback} from '../define/Feedback';
import {RestApiFetch, JsonApiFetch} from '../Fetch';
export async function GetFeedbackList(type:Feedback,page?: number) {
    const url = Urls.feedback_list;
    return RestApiFetch(url+'?type='+type+'&page='+page);

}

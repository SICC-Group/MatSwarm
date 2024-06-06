import Urls from '../Urls';
import JsonApiFetch from '../Fetch';

export async function GetTopicList(){
    const url = Urls.api_v1_ticketing.topic_choice
    return JsonApiFetch(url, 'GET')
}
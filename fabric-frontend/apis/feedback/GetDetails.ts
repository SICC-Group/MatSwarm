import Urls from '../Urls';
import JsonApiFetch from '../Fetch';

export async function getFeedbackDetails(id:number){
    const url = Urls.api_v1_ticketing.ticket_details(id)
    return JsonApiFetch(url, 'GET')
}
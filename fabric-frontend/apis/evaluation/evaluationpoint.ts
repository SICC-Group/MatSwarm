import Urls from '../Urls';
import JsonApiFetch from '../Fetch';

export async function GetEvaluationPoint(){
    const url = Urls.api_cert.evaluation_point;
    return await JsonApiFetch(url , 'GET');
}
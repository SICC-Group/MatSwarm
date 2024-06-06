import JsonApiFetch from '../Fetch';
import Urls from '../Urls';
export async function GetEvaluationResult(id:string ){
    const url = Urls.api_cert.evaluation_result ;
    return await JsonApiFetch(url + id , 'GET');
}
export async function GetEvaluationJudge(acceptance_id: number) {
    return JsonApiFetch<any>(Urls.api_cert.evalucation_judge(acceptance_id), 'GET');
}
export async function GetEvaluationScore(acceptance_id: number) {
    return JsonApiFetch<any>(Urls.api_cert.evalucation_score(acceptance_id), 'GET');
}
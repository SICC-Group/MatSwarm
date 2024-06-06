import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { Evaluation } from '../define/Evaluation';

export interface EvaluationListItem {
    data: [];
    page: number;
    page_size: number;
    total: number;
  }

export async function GetEvaluationList(finished : number, page: number ,page_size:number){
    const url = Urls.api_cert.evaluation_list ;
    if (finished==null){
        return await JsonApiFetch(url +'?page=' + page+'&page_size='+page_size, 'GET');
    }
    else{
        return await JsonApiFetch(url + '?page=' + page+'&page_size='+page_size+'&finished='+finished, 'GET');
    }
    
}
0
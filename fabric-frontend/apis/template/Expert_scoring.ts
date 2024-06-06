import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
export async function GetExpertTemplateScoring(page: number) {
    const url = Urls.expert_scoring+'?page='+page;
    return JsonApiFetch<ExpertTemplateScoring>(url, 'GET');

}
export async function PostExpertTemplateScoring( tId:number,comment:string,score:number) {
    const url = Urls.uploading_scoring;
    return JsonApiFetch(url, 'POST',{
        t_id:tId,
        comment:comment,
        score:score,  
    });    
}
export interface ExpertTemplateScoring{
   t_id:number
   title:string
   acceptance_id:number
   ps_id:number
   is_project:boolean
   owner:string
   leader:string
   is_scored:boolean
}
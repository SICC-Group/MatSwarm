import JsonApiFetch from '../Fetch';
import Urls from '../Urls';
export interface GetThesaurusSearchResult{
    term:string; //术语
    rel:number; //关联度
}
//词库搜索API
export async function ThesaurusSearch(category_id:number,q:string,ret_count:number):Promise<GetThesaurusSearchResult[]>{
    const url = Urls.api_v1_service.thesaurus_search;
    return JsonApiFetch(url+'?category_id='+category_id+'&q='+q+'&ret_count='+ret_count,'GET')
}
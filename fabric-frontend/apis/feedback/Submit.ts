import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
// 提交反馈
export function SubmitFeedback( title:string, content:string, t_type:number){
    const url = Urls.api_v1_ticketing.create_ticket;
    const feedback ={
      "title" : title,
      "content" : content,
      "t_type" : t_type,
    }
    return JsonApiFetch(url, 'POST', feedback);  
  }
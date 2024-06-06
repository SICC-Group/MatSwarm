import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
// 提交反馈
export function SubmitFeedbackReply(content: string, id: number) {
    const url = Urls.api_v1_ticketing.ticket_reply;
    const reply = {
        "content": content,
        "ticket_id": id,
    }
    return JsonApiFetch(url, 'POST', reply);
}

export function ChangeFeedbackStatus(status: string, id: number) {
    const url = Urls.api_v1_ticketing.ticket_change_status(id);
    const type = {
        "type": status
    }
    return JsonApiFetch(url, 'PATCH', type);
}
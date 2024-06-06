import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export interface CreateTicketRet {
    id: number;
}

export enum TicketType {
    PermissonRequest = 1,
    TemplateRelated = 2,
    DataRelated = 3,

    Suggestion = 4,
}

export interface Ticket {
    title: string;
    t_type: TicketType;
    images: any[]; // TODO: 变成文件类型定义
    files: any[]; // TODO: 变成文件类型定义

    content: string;
}

export function CreateTicket(ticket: Ticket): Promise<CreateTicketRet> {
    return JsonApiFetch<CreateTicketRet>(Urls.api_v1_ticketing.create_ticket, 'POST', ticket);
}

import { RestListFetch } from '../Fetch';
import Urls from '../Urls';
import { Ticket } from '../define/Ticket';


export async function ListTicktes(t_type?: Ticket.Type, status?: Ticket.Status, page?: number, ) {
    return RestListFetch<Ticket>(Urls.api_v1_ticketing.tickets, 'GET', { page: page, t_type, status });
}
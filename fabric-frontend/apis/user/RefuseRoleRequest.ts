import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export async function RefuseRoleRequest(ticketID: number, reason: string) {
  return JsonApiFetch(Urls.api_v1_ticketing.finish_ticket, 'POST', {
    ticket_id: ticketID,
    reason: reason,
  })
}

import { Ticket } from '../define/Ticket';
import { UserRole } from '../define/User';
import { ListTicktes } from '../ticketing/List';
import { RestListResult } from '../Fetch';
import { Decode } from '../../utils/Base64';

export interface RoleRequest extends Ticket {
    has_auth_code: boolean;
    roles: UserRole[];
    admin_categorys: number[];
    desc?: string;
    old_style: boolean;
}

export enum RequestStatus {
    Pending = Ticket.Status.Open,
    Refused = Ticket.Status.Ended, // Ended
    Granted = Ticket.Status.Done,  // Finished
    All = -1,
} 

export async function ListRoleRequests(status: RequestStatus, page?: number) {
    const tickets = await ListTicktes(Ticket.Type.RoleRequest, status as any, page);
    const result: RestListResult<RoleRequest> = {
        count: tickets.count, page_size: tickets.page_size,
        next: tickets.next, previous: tickets.previous,
        results: tickets.results.map(ticket => {
            const regExp = /AUTH_CODE\{([^)]+)\}/
            const match = regExp.exec(ticket.content);
            if (match != null) {
                const authCodeStr = Decode(regExp.exec(ticket.content)[1]);
                const roles = /roles=\[([^\]]+)\]/.exec(authCodeStr)[1].split(',').map(s => Number(s) as UserRole);
                const admin_categorys = ((/category=\[([^\]]+)\]/.exec(authCodeStr) || [])[1] || '').split(',').map(s => Number(s));
                const desc = (/desc=\[([^\]]+)\]/.exec(authCodeStr) || [])[1] || '(旧版申请，请自行查看工单内容)';
                return { ...ticket, roles, admin_categorys, has_auth_code: true, desc, old_style: false }
            }
            else {
                return { ...ticket, roles: [], admin_categorys: [],  has_auth_code: false, desc: '(旧版申请，请自行查看工单内容)', old_style: true }
            }
        })
    }
    return result;
}

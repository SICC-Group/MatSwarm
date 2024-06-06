import { CreateTicket, CreateTicketRet } from '../ticketing/Create';
import { UserRole } from '../define/User';
import { Encode } from '../../utils/Base64';

function RolesToString(role: UserRole) {
    switch (role) {
        case UserRole.DOIAdmin: return 'DOI管理权限';
        case UserRole.DataAdmin: return '数据审核权限';
        case UserRole.DataUploader: return '数据上传权限';
        case UserRole.TemplateAdmin: return '模板审核权限';
        case UserRole.TemplateUploader: return '模板上传权限';
        case UserRole.Root: return '开发者权限';
        case UserRole.Verified: return '基本权限';
    }
}

function GenerateAuthCode(desc: string, roles: UserRole[], category?: number[]) {
    if ((roles.includes(UserRole.DataAdmin) || roles.includes(UserRole.TemplateAdmin)) && category) {
        return Encode(`desc=[${desc}]roles=[${roles.join(',')}],category=[${category.join(',')}]`)
    }
    else {
        return Encode(`desc=[${desc}]roles=[${roles.join(',')}]`)
    }
}

export function RequestRoles(roles: UserRole[], desc: string, category?: number[]): Promise<CreateTicketRet> {
    const today = new Date();
    
    const timestamp = 
        `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日${today.getHours()}时${today.getMinutes()}分`;
    const content = `
    <p>申请以下权限：</p>
    <ul>
        ${roles.map((r) => `<li>${RolesToString(r)}</li>`).join('')}
    </ul>
    <p>提交时间：${timestamp}</p>
    <p>授权编码（自动生成，请勿修改）：AUTH_CODE{${GenerateAuthCode(desc, roles, category)}}</p>
    <p>描述：${desc}</p>
    `;

    const ticket = {
        title: `权限申请`,
        t_type: 1, // 1 是权限申请主题
        images: [] as string[],
        files: [] as string[],
        content,
    };
    return CreateTicket(ticket);
}

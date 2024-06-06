

export interface Ticket {
    id: number;
    real_name: string;
    title: string;
    created_at: string;
    ended_at?: string;
    content: string;
    t_type: Ticket.Type;
    status: Ticket.Status;
    new_user_reply: boolean;
    new_admin_reply: boolean;
    
    created_by: string; 
}

export namespace Ticket {
    export enum Type {
        RoleRequest = 1,
        Template = 2,
        Data = 3,
        Suggestion = 4,
    }
    export enum Status {
        // 处理中
        Open = 1,
        // 已完成
        Done = 2,
        // 已关闭
        Ended = 3,
    }
}
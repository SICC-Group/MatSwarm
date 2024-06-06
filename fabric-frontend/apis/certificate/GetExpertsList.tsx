import { JsonApiFetch } from '../Fetch';
import { Urls } from '../Urls';

export interface Expert {
    expert_username: string,
    expert_name: string,
}

export async function GetExpertsList(): Promise<Expert[]> {
    const result = await JsonApiFetch(Urls.api_cert.experts_list);
    return result;
}

export async function GetAssignedExpert(acceptance_id: number): Promise<Expert[]> {
    const result = await JsonApiFetch(Urls.api_cert.acceptance_experts(acceptance_id));
    return result;
}
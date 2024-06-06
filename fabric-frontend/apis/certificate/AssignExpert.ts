import { JsonApiFetch } from '../Fetch';
import { Urls } from '../Urls';

export async function AssignExpert(acceptance_id: number, username_list: string[]) {
    const body = {
        acceptance_id: acceptance_id,
        experts: username_list
    }
    const result = await JsonApiFetch(Urls.api_cert.assign_experts, 'POST', body);
    return result;
}

export async function ModifyExpert(acceptance_id: number, username_list: string[]) {
    const body = {
        acceptance_id: acceptance_id,
        experts: username_list
    }
    const result = await JsonApiFetch(Urls.api_cert.acceptance_experts(acceptance_id), 'PATCH', body);
    return result;
}


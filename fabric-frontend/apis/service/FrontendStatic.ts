import { JsonApiFetch } from '../Fetch';
import Urls from '../Urls';

interface StaticRet {
    id: number;
    name: string;
    description: string;
    content: string;
    is_delete: boolean;
    file: string;
}

export async function GetFrontendStatic(name:string) {
    const url = Urls.api_v1_service.frontend_static + '?name=' + name
    const result =  await JsonApiFetch<StaticRet>(url);
    return result;
}

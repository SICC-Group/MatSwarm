import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export interface MaterialMethod {
    id: number;
    name: string;
    children: MaterialMethod[];
}

export async function GetTemplateMethodTree(): Promise<MaterialMethod[]> {
    // const url = `${Urls.api_v3_storage.material_method}?format=tree`;
    const url = Urls.api_v3_storage.material_method
    return JsonApiFetch(url, 'GET');
}

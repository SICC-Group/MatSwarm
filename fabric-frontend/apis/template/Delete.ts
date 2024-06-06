import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export async function DeleteTemplate(templateID: number): Promise<void> {
    return JsonApiFetch(Urls.api_v1_storage.template_one(templateID), 'DELETE');
}
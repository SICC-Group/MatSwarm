import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export async function CheckTemTitle(title: string): Promise<void> {
    return JsonApiFetch(Urls.storage.check_tem_title(title));
}
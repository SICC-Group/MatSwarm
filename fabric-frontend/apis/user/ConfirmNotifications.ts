import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export async function ConfirmNotif(id: number) {
    return JsonApiFetch<any>(Urls.api_cert.confirm_notification(id), 'PATCH');
}
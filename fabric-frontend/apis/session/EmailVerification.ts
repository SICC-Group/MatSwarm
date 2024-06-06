import { JsonApiFetch } from '../Fetch';
import Urls from '../Urls';

export async function EmailVerification() {
    return JsonApiFetch(Urls.api_v1_account.resend_verification_email, 'POST');
}
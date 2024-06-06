import Urls from '../Urls';
export function GenerateCaptchaUrl(): string {
    return `${Urls.api_v1_account.get_captcha}?r=${Math.random()}`;
}

import { UploadFetch } from '../Fetch';
import Urls from '../Urls';

export async function UploadAvatar(userID: string, img: Blob) {
    let formData = new FormData();
    formData.append('avatar', img);
    return UploadFetch(Urls.api_v1_account.user_avatar(userID), 'POST', formData);
}
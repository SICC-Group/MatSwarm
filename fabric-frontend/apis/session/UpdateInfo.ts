import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { SessionContextType } from '../../components/context/session';

export interface UserInfo {

}

export async function UpdateUserInfo(userID: string, info: any): Promise<void> {
    const url = Urls.api_v1_account.user_resource(userID);
    return JsonApiFetch(url, 'PATCH', info);
}

export async function UpdatePassword(session: SessionContextType, oldPassword: string, newPassword: string) {
    console.log(session);
    return UpdateUserInfo(session.username, {
        email: session.email,
        new_password: newPassword,
        old_password: oldPassword,
    });
}
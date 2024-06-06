import Urls from '../Urls';
import JsonApiFetch from '../Fetch'

export async function MoveOutMemeber(subjectID: string, username:string ) {
    const parameters = "username=" + username;
    const url = `${Urls.api_v1_account.move_out_member(subjectID)}?${parameters}`
    return JsonApiFetch(url, 'DELETE');
}
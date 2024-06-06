import Urls from '../Urls';
import JsonApiFetch from '../Fetch'

export interface SubjectMember {
    username: string,
    real_name: string,
    institution: string,
    email: string,
    roles: number[],
}

export interface SubjectMembersList {
    results: SubjectMember[];
    page: number,
    page_size: number,
    total: number,
}

export async function GetSubjectMemebers(subjectID: string): Promise<SubjectMembersList> {
    return JsonApiFetch(Urls.api_v1_account.subject_users(subjectID));
}

export async function AddSubjectMember(subjectID: string, username: string): Promise<SubjectMembersList> {
    const url = Urls.api_v1_account.subject_users(subjectID) + '?username=' + username;
    return JsonApiFetch(url, 'POST');
}

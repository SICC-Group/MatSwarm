import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { Subject } from '../define/Subject';

export interface Result {
    results: Subject[];
    page: number; // 当前页码
    page_size: number; // 每页大小
    total: number; // 结果数量
}

export async function GetSubjectList(subjectID: string): Promise<Subject[]> {
    return JsonApiFetch(Urls.api_v1_storage.get_material_subjects(subjectID));
}

export async function GetSubjectListTest(username: string, page: number, page_size: number) {
    const url = Urls.api_v1_account.get_user_material_subjects('lijialiang') + '?username=' + username + '&page=' + page + '&page_size=' + page_size;
    const result = await JsonApiFetch<Result>(url, 'GET');
    return result.results;
}

export async function SearchGetSubjectListTest(username: string, page: number, page_size: number) {
    const url = '/api/v1.1/storage/subjects/search/' + '?query=' + username + '&page=' + page + '&page_size=' + page_size;
    const result = await JsonApiFetch<Result>(url, 'GET');
    return result;
}

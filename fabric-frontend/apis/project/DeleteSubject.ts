import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { Project } from '../define/Project';

export async function DeleteSubject(projectId: string, subjectId: string) {
    return JsonApiFetch(Urls.api_v1_storage.delete_subject(projectId, subjectId ), 'DELETE' );
}
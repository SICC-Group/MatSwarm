import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { Project } from '../define/Project';

export async function ChangeSubjectAll(projectID: string, subjectID: string, id: string, project_id: string, name: string, institution: string, leader: string, leader_contact_method: string) {
    const url = Urls.api_v1_storage.delete_subject(projectID, subjectID);
    return JsonApiFetch(url, 'PUT', {
        id, project_id, name, institution, leader, leader_contact_method,
    });
}

export async function ChangeSubject(projectID: string, subjectID: string, name: string, institution: string, leader: string,) {
    const url = Urls.api_v1_storage.delete_subject(projectID, subjectID);
    return JsonApiFetch(url, 'PATCH', {
        name, institution, leader,
    });
}

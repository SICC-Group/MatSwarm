import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { Project } from '../define/Project';

export async function CreateSubject(projectId: string, id: string, name: string, institution: string, username: string) {
    const url = Urls.api_v1_storage.create_material_subjects(projectId);
    return JsonApiFetch(url, 'POST', {
        id, name, institution, leader: username,
    });
}
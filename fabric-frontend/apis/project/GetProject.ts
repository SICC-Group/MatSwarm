import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { Project } from '../define/Project';

export async function GetProject(projectID: string): Promise<Project> {
    return JsonApiFetch(Urls.api_v1_storage.get_material_project(projectID));
}
import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { TrendData, Counts } from '../analytics/Get'

export interface SubjectInfo {
    id: string,
    institution: string,
    leader: string,
    leader_contact_method: string,
    name: string,
    project_id: string,
}

export interface ProjectInfo {
    created_time: string,
    id: string,
    institution: string,
    leader: string,
    leader_contact_method: string,
    name: string,
    responsible_expert: string,
    subjects: SubjectInfo[]
}

export async function GetSpecificProject(id: string): Promise<ProjectInfo> {
    return JsonApiFetch(Urls.api_v1_1_storage.specific_material_project(id));
}

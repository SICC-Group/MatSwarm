import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export interface ProjectInfo{
    id: string;
    name: string;
    leader: string;
    data_count: number;
    tem_count: number;
}

export function ProjectAnalytisOverview(): Promise<ProjectInfo[]> {
    const url = Urls.api_v1_1_storage.projects_analytics_info;
    const result = JsonApiFetch<ProjectInfo[]>(url);
    return result;
}
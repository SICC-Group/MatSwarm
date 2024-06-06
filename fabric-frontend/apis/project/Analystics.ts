import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

interface RelatedTemplateInfo {
    id: number;
    name: string;
}
interface RelatedCategoriesInfo {
    id: number;
    name: string;
}

export interface TrendData {
    date: number;
    data: number[];
}

export interface AnalyticsData {
    templates: RelatedTemplateInfo[];
    categories: RelatedCategoriesInfo[];
    trend: TrendData[];
    data_count: number;
    template_count: number;
}


export function GetProjectAnalytics(project_id: string, end = 201911, beg = 201901): Promise<AnalyticsData> {
    const parameters = "beg=" + beg + "&end=" + end;
    const url = `${Urls.api_v1_analytics.project_analystics(project_id)}?${parameters}`;
    const result = JsonApiFetch<AnalyticsData>(url);
    return result;
}

export function GetSubjectAnalytics(project_id: string, subject_id: string, end = 201911, beg = 201901): Promise<AnalyticsData> {
    const parameters = "beg=" + beg + "&end=" + end;
    const url = `${Urls.api_v1_analytics.subject_analystics(project_id, subject_id)}?${parameters}`;
    const result = JsonApiFetch<AnalyticsData>(url);
    return result;
}
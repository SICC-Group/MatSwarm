import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { TrendData, Counts, CategoryData, RawCategoryData } from '../analytics/Get'

export interface ProjectAll {
    id: string,
    name: string,
}

export async function GetProjectList(): Promise<ProjectAll[]> {
    return JsonApiFetch(Urls.api_v1_1_storage.project_all);
}

export interface Related {
    id: number,
    name: string,
}
interface ProjectTrend {
    date: number,
    data: number[],
}
export interface RawProjectAnalyticsInfo {
    templates: Related[],
    categories: RawCategoryData[],
    trend: ProjectTrend[],
    data_count: number,
    template_count: number,
    ac_status:string;//项目验收状态

}

export interface ProjectAnalyticsInfo {
    id:string,
    templates: Related[],
    categories: CategoryData[],
    trend: TrendData[],
    data_count: number,
    template_count: number,
    ac_status:string;//项目验收状态
}

function ArrayToCounts(arr: number[]): Counts {
    return { view: arr[0], download: arr[1], data: arr[3], template: arr[2] };
}

function RawTrendTransform(rawTrend: ProjectTrend): TrendData {
    return {
        year: Math.floor(rawTrend.date / 100),
        month: rawTrend.date % 100,
        counts: ArrayToCounts(rawTrend.data),
    };
}

function Transform(raw: RawProjectAnalyticsInfo,id:string): ProjectAnalyticsInfo {
    const classList: CategoryData[] = (raw.categories ? raw.categories.map((value) => ({ name: value.name, id: value.id, counts: ArrayToCounts(value.data)})) : []);
    return {
        id:id,
        templates: raw.templates,
        categories: classList,
        trend: raw.trend.map((value) => RawTrendTransform(value)),
        data_count: raw.data_count,
        template_count: raw.template_count,
        ac_status: raw.ac_status,
    };
}

export async function GetProjectAnalytics(projectID: string, end: number, beg = 201901, subjectID?: string): Promise<ProjectAnalyticsInfo> {
    const parameters = "beg=" + beg + "&end=" + end;
    var url = '';
    if (subjectID) {
        url = `${Urls.api_v1_1_storage.get_subject_analytics(projectID, subjectID)}?${parameters}`;
    }
    else {
        url = `${Urls.api_v1_1_storage.get_project_analytics(projectID)}?${parameters}`;
    }
    const result = await JsonApiFetch(url, 'GET');
    return Transform(result, subjectID ? subjectID : projectID);
}

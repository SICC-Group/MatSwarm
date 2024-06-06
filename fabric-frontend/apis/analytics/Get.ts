import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export interface RawCategoryData {
    name: string;
    id: number;
    data: number[];
}

interface RawTrendData {
    date: number;
    data: number[];
}

export interface Acceptance {
    2016: number[];
    2017: number[];
    2018: number[];
    total: number[];
}

export interface RawAnalyticsData {
    acceptance: Acceptance;
    global: number[];
    class: RawCategoryData[];
    trend: RawTrendData[];
    distribution:any;
    applycount:any;
    uploadtime:any;
}

export interface Counts {
    view: number;
    download: number;
    data: number;
    template: number;
}

export interface CategoryData {
    name: string;
    id: number;
    counts: Counts;
}

export interface TrendData {
    year: number;
    month: number;
    counts: Counts;
}

export interface AnalyticsData {
    acceptance:Acceptance;
    global: Counts;
    class: CategoryData[];
    trend: TrendData[];
    distribution:any;
    applycount:any;
    uploadtime:any;
}

function ArrayToCounts(arr: number[]): Counts {
    return { view: arr[0], download: arr[1], data: arr[3], template: arr[2] };
}


function RawTrendTransform(rawTrend: RawTrendData): TrendData {
    return {
        year: Math.floor(rawTrend.date / 100),
        month: rawTrend.date % 100,
        counts: ArrayToCounts(rawTrend.data),
    };
}



function RawAnalyticsTransform(raw: RawAnalyticsData): AnalyticsData {
    const classList: CategoryData[] = (raw.class ? raw.class.map((value) => ({ name: value.name, id: value.id, counts: ArrayToCounts(value.data)})) : []);
    return {
        acceptance:raw.acceptance,
        global: ArrayToCounts(raw.global),
        class: classList,
        trend: raw.trend.map((value) => RawTrendTransform(value)),
        distribution:raw.distribution,
        uploadtime:raw.uploadtime,
        applycount:raw.applycount
    };
}

export function GetGlobalAnalytics(): Promise<AnalyticsData> {
    return JsonApiFetch<RawAnalyticsData>(Urls.api_v1_analytics.index).then((value) => {
        return RawAnalyticsTransform(value);
    });
}

export function GetCategoryAnalytics(id: number): Promise<AnalyticsData> {
    return JsonApiFetch(Urls.api_v1_analytics.query_class(id)).then((value) => {
        return RawAnalyticsTransform(value);
    });
}

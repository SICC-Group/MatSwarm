import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export async function PassTemplate(templateID: number): Promise<void> {
    return JsonApiFetch(Urls.api_v2_storage.review_template(templateID), 'PATCH', {
        approved: true,
    });
}

export enum RefuseReason {
    Other = 0,
    MissingMeta = 1,
    MissingCondition = 2,
    MissingPerformanceInfo = 3,
    MissingComonents = 4,
    InformalTitle = 5,
    MissingReference = 6,
    MissingContributor = 7
}

export async function RefuseTemplate(templateID: number, reason: RefuseReason | string): Promise<void> {
    return JsonApiFetch(Urls.api_v2_storage.review_template(templateID), 'PATCH', {
        approved: false,
        reason: reason,
    });
}

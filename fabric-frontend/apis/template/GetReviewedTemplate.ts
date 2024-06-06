import Urls from '../Urls';
import { RestApiFetch } from '../Fetch';
import { TemplatesReview } from '../define/TemplateReview';

export type Result = TemplatesReview;

export async function GetReviewedTemplate(uploadID: number): Promise<Result> {
    return RestApiFetch(Urls.api_v3_storage.templates_detail(uploadID));
}
import Urls from '../Urls';
import JsonApiFetch, { RestListFetch2 } from '../Fetch';
import { ReviewState } from '../define/ReviewState';
import { TemplatesReview } from '../define/TemplateReview';

export type ItemType = TemplatesReview;

export async function ListTemplates(reviewState: ReviewState, page: number, pri:boolean = true) {
    const url = Urls.api_v3_storage.templates_list;
    if (reviewState === ReviewState.All) {
        return RestListFetch2<ItemType>(url, 'GET', { page: page, private: pri });
    }
    else {
        return RestListFetch2<ItemType>(url, 'GET', { page: page, review_state: reviewState,  private: pri });
    }
}

export async function ListAllTemplates(page: number = 1, query: string = '') {
    const url = Urls.api_v3_storage.templates_list;
    return RestListFetch2<ItemType>(url, 'GET', { page: page, query: query });
}

export async function ListDataTemplates() { //获取用户数据所在的模板列表
    const url = Urls.api_v1_storage.data_templates;
    return JsonApiFetch(url,'GET')
}
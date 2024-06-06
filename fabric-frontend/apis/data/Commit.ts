import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { AnyField } from '../define/Field';
import { Data } from '../define/Data';

const isEmpty = (s: string): boolean => {
    return (s == null || s.trim().length === 0);
}

// 检查元数据
function CheckDataMeta(meta: Data.MetaBase) {

    if (isEmpty(meta.title)) {
        throw {
            id: 'error_data_title_empty',
        };
    }
    if (isEmpty(meta.abstract)) {
        throw {
            id: 'error_data_abstract_empty',
        };
    }
    if (meta.keywords.length === 0) {
        throw {
            id: 'error_data_keywords_empty',
        };
    }
    if (meta.methods.size === 0) {
        throw {
            id: 'error_data_methods_empty',
        };
    }
    if (meta.source === Data.Source.Extract && isEmpty(meta.reference)) {
        throw {
            id: 'error_data_reference_empty',
        };
    }
    // if (isEmpty(meta.project)) {
    //     throw {
    //         id: 'error_data_project_empty',
    //     }
    // }
    // if (isEmpty(meta.subject)) {
    //     throw {
    //         id: 'error_data_subject_empty',
    //     }
    // }
}

function PruneData(data: any) {

}

// 检查数据内容是否符合必填要求
function CheckContent(data: any, template: AnyField[]) {
    // 首先清理数据内容，删除掉空字段
    PruneData(data);
    // 不能整个都为空
    if (Object.keys(data).length === 0) {
        throw {
            id: 'error_data_content_empty',
        }
    }
    // 遍历模板检查
    // TODO: 检查required属性
}

function MethodsToString(set: any) {
    const a = set.has(Data.Method.Calculation) ? '1' : set.has('computation') ? '1' : '0';
    const b = set.has(Data.Method.Experiment) ? '1' : set.has('experiment') ? '1' : '0';
    const c = set.has(Data.Method.Production) ? '1' : set.has('production') ? '1' : '0';
    const d = set.has(Data.Method.Other) ? '1' : set.has('other') ? '1' : '0';
    return `${a}${b}${c}${d}`;
}

export async function CommitData(metaData: Data.MetaBase, content: any, template: AnyField[], templateMain: any) {
    // const url = Urls.api_v1_1_storage.data_full;
    const url =  'http://localhost:9001' + Urls.api_v1_1_storage.data_full;
    CheckDataMeta(metaData);
    CheckContent(content, template);
    console.log('------', templateMain.content)
    templateMain.content = JSON.stringify(templateMain.content)
    // templateMain.category_name

    return JsonApiFetch<number>(url, 'POST', {
        meta: {
            title: metaData.title,
            abstract: metaData.abstract,
            doi: metaData.doi,
            keywords: metaData.keywords.join(','),
            tid: metaData.tid,
            // category: metaData.categoryID,

            // 公开时间，范围在前，时间在后
            public_range: metaData.public_range,
            public_date: metaData.public_date,
            contributor: metaData.contributor,
            institution: metaData.institution,

            source: {
                source: metaData.source,
                reference: metaData.reference,
                methods: MethodsToString(metaData.methods),
            },
            other_info: {
                project: "2016YFB0700500",
                subject: "2016YFB0700503",
            },
          category: templateMain.category_id,
          category_name: templateMain.category_name != null ? templateMain.category_name : String(templateMain.category),
          template: templateMain
        },
        content: JSON.stringify(content)
        // content: "11: \"11\""
    });
}

export async function PatchData(dataID: number, metaData: Data.MetaBase, content: any, template: AnyField[]) {
    const url = Urls.api_v2_storage.get_data(dataID);
    CheckDataMeta(metaData);
    CheckContent(content, template);
        console.log('data commit', metaData.methods)

    return JsonApiFetch<number>(url, 'PATCH', {
        meta: {
            title: metaData.title,
            abstract: metaData.abstract,
            doi: metaData.doi,
            keywords: metaData.keywords.join(','),
            tid: metaData.tid,
            // category: metaData.categoryID,

            // 公开时间，范围在前，时间在后
            public_range: metaData.public_range,
            public_date: metaData.public_date,
            contributor: metaData.contributor,
            institution: metaData.institution,
            source: {
                source: metaData.source,
                reference: metaData.reference,
                methods: MethodsToString(metaData.methods),
            },
            other_info: {
                project: metaData.project,
                subject: metaData.subject,
            },
        },
        content
    });
}



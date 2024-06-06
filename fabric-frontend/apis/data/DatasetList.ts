import Urls from '../Urls';
import { JsonApiFetch } from '../Fetch';
import { Dataset } from '../define/Dataset';

export interface Result {
    results: Dataset[];
    page: number;
    page_size: number;
    total: number;
}

export async function DatasetList(page: number, page_size: number = 10) {
    const parameters = "page=" + page + "&page_size=" + page_size;
    const url = `${Urls.api_v3_storage.create_dataset}?${parameters}`;
    const result = await JsonApiFetch<Result>(url, 'GET');
    return result;
}

export interface AddDatasetInfo {
    data_ids: number[];
    title: string;
    project: string;
    contributor: string;
}
export async function AddDataset(body: AddDatasetInfo): Promise<{ id: number }> {
    const result = await JsonApiFetch<{ id: number }>(Urls.api_v3_storage.create_dataset, 'POST', body);
    return result;
}

export async function DeleteDataset(id: number) {
    const url = `${Urls.api_v3_storage.create_dataset}/${id}`;
    const result = await JsonApiFetch<{ id: number }>(url, 'DELETE');
    return result;
}

export interface DatasetInfo {
    id: number;
    username: string;
    contributor: string;
    title: string,
    project: string,
    doi: string,
    data_ids: number[];
    page: number,
    page_size: number,
    total: number,
}

export async function ViewDataset(id: number) {    
    return JsonApiFetch<DatasetInfo>(Urls.api_v3_storage.manage_dataset_one(id));
}

export interface DatasetIds {
    dataset_ids: number[];
}
export async function RegisterDoi(datasets: DatasetIds) {
    const result = await JsonApiFetch<{ code: number }>(Urls.api_v3_storage.register_doi, 'POST', datasets);
    return result;
}

export async function TempalteDataRegisterDoi(template_id:number) { //为某一模板下的所有数据申请DOI
    const  result = await JsonApiFetch<any>(Urls.api_v1_storage.data_dois, 'POST', 
    {
        template_id:template_id
    }
    );
    return result;
}
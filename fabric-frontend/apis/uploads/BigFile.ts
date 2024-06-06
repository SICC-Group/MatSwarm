import Urls from '../Urls';

import { RestApiFetch, RestApiFetch_mulFile } from '../Fetch';

// 1上传准备
export interface PrepareDataResult {
    msg: string;
    code: number;
    uuid: string;
}
export async function PrepareData(): Promise<PrepareDataResult> {
    const url = Urls.big_file('uuid');
    const result = RestApiFetch<PrepareDataResult>(url, 'GET');
    return result;
}

// 2 and 3 分片确认和分片上传
export async function ConfirmAndUpload(data_file: Blob, data_number: number, data_uuid: string, data_count: number, data_name: string): Promise<any> {
    const url = Urls.big_file('slice');
    const url2 = url + '?number=' + data_number + '&uuid=' + data_uuid;
    const result2 = RestApiFetch<ConfirmDataResult>(url2, 'GET');
    if (!(await result2).code) {
        // console.log(result2, (await result2).code, '不存在，上传');
        // 下面进行分片上传
        let formData = new FormData();
        formData.append('file', data_file);
        formData.append('number', data_number + '');
        formData.append('uuid', data_uuid);
        const result3 = RestApiFetch_mulFile<any>(url, 'POST', formData );
        // console.log(result3, data_number, data_count, !(await result3).code, data_number === (data_count - 1));
        if (!(await result3).code){
            return 1;
        } // 其他情况报错
    }else{
        console.log('存在');
        return 1;
    }
    return 0;
}

// 4 and 6 完成确认和确认文件上传
export async function ConfirmDoneAndExist(data_file: Blob, data_number: number, data_uuid: string, data_count: number, data_name: string): Promise<ConfirmUploadResult> {
    console.log('最后一片上传完成，下面开始确认');
    const url4 = Urls.big_file('bigfile');
    const url6 = Urls.bigFile_confirm;
    // 4完成确认
    const result4 = RestApiFetch<ConfirmDoneResult>(url4 + '?uuid=' + data_uuid + '&count=' + data_count + '&fileName=' + data_name, 'POST');
    if (!(await result4).code) {
        console.log('确认完成');
        // 6确认文件上传
        var JsonFile = JSON.stringify({ path: (await result4).path, name: data_name });
        const result6 = RestApiFetch_mulFile<ConfirmUploadResult>(url6, 'POST', JsonFile);
        console.log(await result6);
        return result6;
    }
}

// 2分片确认
export interface ConfirmDataResult {
    msg: string;
    code: number;
}
export async function ConfirmData(numberl: number, uuid: string): Promise<ConfirmDataResult> {
    let url = Urls.big_file('slice');
    url = url + '?number=' + numberl + '&uuid=' + uuid;
    const result = RestApiFetch<ConfirmDataResult>(url, 'GET');
    return result;
}

// 3分片上传
export interface UploadDataResult {
    msg: string;
    code: number;
}
export async function UploadData(data_file: Blob, data_number: number, data_uuid: string): Promise<UploadDataResult> {
    const url = Urls.big_file('slice');
    let formData = new FormData();
    formData.append('file', data_file);
    formData.append('number', data_number + '');
    formData.append('uuid', data_uuid);
    const result = RestApiFetch_mulFile<UploadDataResult>(url, 'POST', formData );
    return result;
}

// 4完成确认
export interface ConfirmDoneResult {
    msg: string;
    code: number;
    path: string;
}
export async function ConfirmDone(data_uuid: string, data_name: string, data_count: number): Promise<ConfirmDoneResult> {
    const url = Urls.big_file('bigfile');
    const result = RestApiFetch<ConfirmDoneResult>(url + '?uuid=' + data_uuid + '&count=' + data_count + '&fileName=' +  data_name, 'POST');
    // console.log(result);
    return result;
}

// 5检查文件是否存在
export interface ConfirmExistResult {
    msg: string;
    code: number;
}
export async function ConfirmExist(path_data: string): Promise<ConfirmExistResult> {
    const url = Urls.big_file('bigfile/info') + '?path=' + path_data;
    const result = RestApiFetch<ConfirmExistResult>(url, 'GET');
    return result;
}

// 6确认文件上传
export interface ConfirmUploadResult {
    code: number;
    data: string;
}
export async function ConfirmUpload(path_data: string, data_name: string): Promise<ConfirmUploadResult> {
    const url = Urls.bigFile_confirm;
    let con_data = { path: path_data, name: data_name};
    var JsonFile = JSON.stringify(con_data);
    const result = RestApiFetch_mulFile<ConfirmUploadResult>(url, 'POST', JsonFile);
    // console.log(result);
    return result;
}

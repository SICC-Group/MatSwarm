import {JsonApiFetch,JsondataApiFetch} from '../Fetch';
import Urls from '../Urls';

export async function PassUpload(uploadID: number): Promise<void> {
    return JsonApiFetch(Urls.api_v2_storage.review_data_history(uploadID), 'PATCH', {
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

export async function RefuseUpload(uploadID: number, reason: RefuseReason | string): Promise<void> {
    return JsonApiFetch(Urls.api_v2_storage.review_data_history(uploadID), 'PATCH', {
        approved: false,
        reason: reason,
    });
}
export async function RefuseUpload1(uploadID: number,reason:string): Promise<any> {  //大科学装置审核驳回接口
    let reasonarr = reason.split(';') //将reason划分为数组
    var data = [];
    for (let i = 0;i<reasonarr.length;i++){
        data.push({reprotId:String(uploadID),msg:String(reasonarr[i]),state:String(-1)})
    } //body
    return JsondataApiFetch(Urls.api_v2_storage.review_data_refuse,'POST',data);
}
export async function WithdrawUpload(uploadID: number): Promise<void> {
    return JsonApiFetch(Urls.api_v2_storage.review_withdraw(uploadID),'PATCH');
}

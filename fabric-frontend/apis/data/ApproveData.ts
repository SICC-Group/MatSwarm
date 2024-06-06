import Urls from '../Urls';
import {JsonApiFetch} from '../Fetch';

export interface approve_data {
  data: any;
}

export async function ApproveData(meta_id: number ): Promise<approve_data> {
  const data_patch = {approved: true};
  const result = await JsonApiFetch<approve_data>(Urls.api_v2_storage.review_data(meta_id), 'PATCH', data_patch);
  return result;
}

export async function DisApproveData(meta_id: number, reason_number: number[] ): Promise<approve_data> {
  const data_patch = {approved: false, reasons: reason_number };
  const result = await JsonApiFetch<approve_data>(Urls.api_v2_storage.review_data(meta_id), 'PATCH', data_patch);
  return result;
}

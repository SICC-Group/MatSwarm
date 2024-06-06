import {JsonApiFetch} from '../Fetch';
import Urls from '../Urls';

export interface DelData {
      data: any;
    }

export async function DeletData(data_ID: number): Promise<DelData> {
      const result = await JsonApiFetch<DelData>(Urls.api_v1_storage.data_meta_one(data_ID), 'DELETE');
      return result;
}

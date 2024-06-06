import {JsonApiFetch, RestApiFetch} from '../Fetch';
import Urls from '../Urls';
import { Template } from '../define/Template';
import { Data } from '../define/Data';

export interface RawResult extends Data.RawMeta{
  content: any;
  template: Template.RawFull;
}

export interface GetDataResult {
  meta: Data.Meta;
  content: Data.Content;
  template: Template.Full;
}

export async function RawGetData(id: number | string) {
  // return JsonApiFetch<RawResult>(Urls.api_v2_storage.get_data(id));
  return JsonApiFetch('http://localhost:9001/api/v2/storage/data?dataID=' + id );
}

export async function GetData(id: number): Promise<GetDataResult> {
  const result = await JsonApiFetch<RawResult>(Urls.api_v2_storage.get_data(id));
  return {
    meta: Data.fromRawDataMeta(result),
    content: result.content,
    template: Template.fromRaw(result.template),
  }
}

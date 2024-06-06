import { Dict } from '../define/Dict';
import JsonApiFetch from '../Fetch';
import Urls from '../Urls';
import { StorageDict } from '../../utils/StorageDict';

// Raw
async function RawGetTempalteNames(tids: number[]) {

  if (tids.length === 0) {
    return new Dict<string>({});
  }
  const url = Urls.api_v2_storage.template_names + '?list=' + tids.join(',');
  return JsonApiFetch<Dict<string>>(url).then((data) => {
    return new Dict<string>(data);
  });
}

export async function GetTemplateNames(...tids: number[]) {
  const nameDict = new StorageDict<string>('template-names');
  const filtered = tids.filter(id => nameDict.Get(String(id)) == null);
  const data = await RawGetTempalteNames(filtered);
  data.forEach((k, v) => nameDict.Set(k, v));
  return nameDict;
}

import Urls from '../Urls';
import {JsonApiFetch} from '../Fetch';
import {Export} from '../define/Export';

export interface ExportConfig {
  flat: boolean;
  toOCPMDM: boolean;
  dataIDs?: number[];
  format: Export.FileType;
  fields?: string[];
  query_id?: number;
  tid?: number;
}

export interface export_url {
  async: boolean;
  result: string;
}

// 数据详情页面 以及 我的数据页面导出
export async function ExportData(format_get:string, dataIDs: string[], async_get: boolean): Promise<export_url> {
  //  const xxxx = {format: "JSON", meta_id_list: ["83052"], async: false};
  const data_post = {format: format_get, meta_id_list: dataIDs, async: async_get};
  const result = await JsonApiFetch<export_url>(Urls.api_v1_storage.data_export, 'POST', data_post);
  window.open(result.result);
  return result;
}

export interface ExportDataResult {
  async: boolean;
  result: string;
}

// 搜索界面导出
export async function ExportData2(config: ExportConfig): Promise<ExportDataResult> {
  return JsonApiFetch<export_url>(Urls.api_v1_storage.data_export, 'POST', {
    flat: config.flat,
    format: config.format,
    included_fields: config.fields,
    target: config.toOCPMDM ? 'ocpmdm': undefined,
    meta_id_list: config.dataIDs,
    async: true,
    query_id: config.query_id,
    tid: config.tid == null ? undefined : String(config.tid)
  });
}

// 数据导出  数据观（可视化）
export async function ExportSJG(dataIDs: number[]){
  const result = await JsonApiFetch(Urls.api_v4_storage.sjg,'POST',{
    'meta_ids': dataIDs,
  });
  console.log(result);
  window.open((result.redirect_url));
  return result;
}


// 20平台 获取用户空间列表
export function GetSavePath( token ?: string, path ?: string) {
  const url_ = '/api/v1/userspace/get_save_path?Authorization=' + token;
  const url = 'http://58.246.132.30:12202/' + url_;
  if (path != null) {
    return JsonApiFetch(url + '&parentPath=' + path);
  }
  return JsonApiFetch(url);
}

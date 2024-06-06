import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export type ExportTemplateResult = string; 

export enum TemplateExportFileType {
  Excel = 'xlsx', JSON = 'json', XML = 'xml'
}
export async function ExportTemplate(templateID: number, type: TemplateExportFileType): Promise<ExportTemplateResult> {
  return JsonApiFetch<Promise<ExportTemplateResult>>(`${Urls.api_v1_storage.template_file(templateID)}?type=${type}`);
}

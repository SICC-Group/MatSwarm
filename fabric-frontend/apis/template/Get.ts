import { RawFieldToField, AnyField } from '../define/Field';
import { RawContainerField } from '../define/RawField';
import { Template } from '../define/Template';
import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export interface RawGetTemplateRet extends Template.Info {
  content: RawContainerField;
}

export async function RawGetTemplate(templateID: number): Promise<RawGetTemplateRet> {
  // return JsonApiFetch(Urls.api_v1_storage.template_one(templateID));
  return JsonApiFetch('http://localhost:9001/api/v1/storage/template?templateID=' + templateID);
}

export function RawTemplateContentToTemplateContent(rawContent: any): AnyField[] {
  return (rawContent as any)._ord.map((s: string) => RawFieldToField(rawContent[s], s));
}

export async function GetTemplate(templateID: number): Promise<Template.Full> {
  const rawData = await RawGetTemplate(templateID);
  const content = RawTemplateContentToTemplateContent(rawData.content);
  const ret: Template.Full = { ...rawData, content };
  return ret;
}

interface _GetMyTemplatesResult {
  templates: Template.RawFull[];
  total: number;
}

async function _GetMyTemplates(): Promise<_GetMyTemplatesResult> {
  return JsonApiFetch(Urls.api_v1_storage.templates + '?private=true');
}

export interface GetMyTemplatesResult {
  templates: Template.Full[];
  total: number;
}

export async function GetMyTemplates(): Promise<GetMyTemplatesResult> {
  const rawResult = await _GetMyTemplates();
  return {
    templates: rawResult.templates.map(Template.fromRaw),
    total: rawResult.total,
  }
}

export async function GetTemplateNew(templateID: number) {
  const rawData = await JsonApiFetch(Urls.api_v3_storage.templates_detail(templateID));
  const content = RawTemplateContentToTemplateContent(rawData.content);
  const ret = { ...rawData, content };
  return ret;
}

export async function GetTemEvalution(templateID: number): Promise<void> {
  return JsonApiFetch(Urls.templates.view_template_evalution(templateID));
}

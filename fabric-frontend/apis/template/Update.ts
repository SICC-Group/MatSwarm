import JsonApiFetch from '../Fetch';
import Urls from '../Urls';
import { AnyField } from '../define/Field';
import { TemplateToRawTemplate } from '../define/FieldTypeConversion';

export interface TemplateMeta {
  title: string;
  categoryID: number,
  abstract: string;
  publish: boolean;
  method: number;
}

function checkMeta(meta: TemplateMeta) {
  if (meta.title == null || meta.title.trim().length === 0) {
    throw {
      id: 'error_template_title_empty',
    };
  }
  if (meta.categoryID == null || meta.categoryID <= 0) {
    throw { id: 'error_template_category_id' };
  }
  if (meta.abstract == null || meta.abstract.trim().length === 0) {
    throw { id: 'error_template_abstract_empty' };
  }
  if (meta.method == null) {
    throw { id: 'error_template_method' };
  }
}

export async function UpdateTemplate(templateID: number, meta: TemplateMeta, content: AnyField[]): Promise<{}> {
  checkMeta(meta);
  const rawField = TemplateToRawTemplate(content);
  const url = Urls.api_v3_storage.templates_detail(templateID);
  return JsonApiFetch(url, 'PATCH', {
    title: meta.title,
    category: meta.categoryID,
    abstract: meta.abstract,
    published: meta.publish,
    method: meta.method,
    content: rawField,
  });
}
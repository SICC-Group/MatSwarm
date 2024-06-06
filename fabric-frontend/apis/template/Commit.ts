import JsonApiFetch from '../Fetch';
import Urls from '../Urls';
import { AnyField } from '../define/Field';
import { TemplateToRawTemplate } from '../define/FieldTypeConversion';

export interface TemplateMeta {
  title: string;
  categoryID: number,
  categoryName?: string,
  abstract: string;
  publish: boolean;
  identifier: string;
  method: number;
}

function checkMeta(meta: TemplateMeta) {
  if (meta.title == null || meta.title.trim().length === 0) {
    throw {
      id: 'error_template_title_empty',
    };
  }
  // if (meta.categoryID == null || meta.categoryID <= 0) {
  //   throw { id: 'error_template_category_id' };
  // }
  if (meta.abstract == null || meta.abstract.trim().length === 0) {
    throw { id: 'error_template_abstract_empty' };
  }
  // if (meta.method == null) {
  //   throw { id: 'error_template_method' };
  // }
}

export interface CommitTemplateResult {
  templateID: number;
}

export async function CommitTemplate(meta: TemplateMeta, content: AnyField[]): Promise<CommitTemplateResult> {
  checkMeta(meta);
  const rawField = TemplateToRawTemplate(content);
  // const url = Urls.api_v3_storage.templates_list;
  const url =  'http://localhost:9001' + Urls.api_v3_storage.templates_list;
  return JsonApiFetch<Number>(url, 'POST', {
    title: meta.title,
    categoryId: 2,
    category: '稀土光功能材料数据库',
    abstract: meta.abstract,
    published: meta.publish,
    method: 4,
    identifier: meta.identifier,      // 增加标识符字段
    content: JSON.stringify(rawField),
  }).then(value => {
    return {
      templateID: Number(value)
    }
  })
}

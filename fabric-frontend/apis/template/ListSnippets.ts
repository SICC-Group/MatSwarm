import Urls from '../Urls';
import JsonApiFetch, { RestListFetch2 } from '../Fetch';
import { TemplateToRawTemplate } from '../define/FieldTypeConversion';
import { AnyField } from '../define/Field';
import {RawTemplateContentToTemplateContent} from '../../apis/template/Get'

export async function create_snippet(snippet_name:string,content:AnyField[]) { //创建模板片段
    const url = Urls.api_v3_storage.create_snippets;
    const rawField = TemplateToRawTemplate(content);
    return JsonApiFetch(url,'POST',{
        snippet_name:snippet_name,
        content:rawField
    })
}

export async function get_snippets(page: number) { //获取用户创建的所有模板片段
    const url = Urls.api_v3_storage.get_snippets;
    return JsonApiFetch(url+'?page='+page,'GET')
}

export async function edit_snippet(id:number,snippet_name:string,content:AnyField[]) { //修改模板片段
    if (snippet_name == "" ) {
        throw {
          id: 'error_template_title_empty',
        };
      }
    const url = Urls.api_v3_storage.edit_snippets(id);
    const rawField = TemplateToRawTemplate(content);
    return JsonApiFetch(url,'PATCH',{
        snippet_name:snippet_name,
        content:rawField
    })
}

export async function get_snippet_one(id:number) { //查看某一个模板片段具体内容
    const rawData = await JsonApiFetch(Urls.api_v3_storage.get_snippets_one(id),'GET');
    const content = RawTemplateContentToTemplateContent(rawData.content);
    const ret = { ...rawData, content };
    return ret;
}

export async function delete_snippet(id:number) { //删除模板片段
    const url = Urls.api_v3_storage.edit_snippets(id);
    return JsonApiFetch(url, 'DELETE');
}
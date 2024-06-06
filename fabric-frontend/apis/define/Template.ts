import { AnyField, RawFieldToField, ContainerField } from './Field';

export namespace Template {
    // 可以由用户上传/修改的元数据
    export interface InfoBase {
        abstract: string;
        title: string;
        category_id: number;
        published: boolean;
        method: number;
    }

    // 由系统自动完成的字段
    export interface Info extends InfoBase {
        id: number;
        ref_count: number;
        pub_date: string;
        author: string;
        category: string;
    }

    // 模板内容字段
    export type Content = AnyField[];
    // 未经转换的模板内容
    export interface RawContent {
        [field: string]: any; 
        _ord: string[];
    }
    // 完整的模板，带有数据内容
    export interface Full extends Info{
        content: Content;
    }
    // 完整的模板，内容是原始格式
    export interface RawFull extends Info {
        content: RawContent;
    }

    // 原始模板内容转换成前端使用的格式
    function RawContentTransform(raw: RawContent): Content {
        return raw._ord.map((s: string) => RawFieldToField(raw[s], s));
    }

    export function fromRaw(raw: RawFull): Full {
        const content = RawContentTransform(raw.content);
        const result: Full = { ...raw, content };
        return result;
    }

    export function FindWithTitle(fields: AnyField[], title: string): AnyField | null {
        for (let i = 0; i < fields.length; ++i) {
            if (fields[i].title === title) {
                return fields[i];
            }
        }
        return null;
    }

    export function GetFieldByPathString(content: Content, pathStr: string): AnyField | null {
        const path = pathStr.split('.');
        if (path.length === 0) {
            throw `Invalid path string: ${pathStr} in template: ${content}`;
        }

        let current = FindWithTitle(content, path[0]);
        if (path.length === 1) return current;

        for (let i = 1; i < path.length; ++i) {
            current = FindWithTitle((current as ContainerField).children, path[i]);
        }
        return current;
    }
}
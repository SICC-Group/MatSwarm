import { AnyField, ContainerField } from './Field';
import { RawField } from './RawField';
import { FieldType } from './FieldType';
import { ChoiceItem, ChoiceGroupItem } from './ChoiceGroup';

function ChoiceItemToRawChoiceItem(choices: ChoiceItem[], path: number[]): any {
    const misc = {
        grp: [] as ChoiceGroupItem[],
        opt: [] as string[]
    }

    const checkArray = (arr: string[], nameSet: Set<string>): boolean => {

        if(arr.length === 0) {
            throw {
                id: 'error_template_choice_field_group_empty',
                path
            }
        }
        for (let i = 0; i < arr.length; ++i) {
            if (arr[i].trim().length === 0) {
                throw {
                    id: 'error_template_choice_field_name_empty',
                    path
                }
            }
            if (nameSet.has(arr[i])) {
                return false;
            }
            nameSet.add(arr[i]);
        }
        return true;
    }

    const set = new Set<any>();
    for (let i = 0; i < choices.length; ++i) {

        if (Object.keys(choices[i]).includes('name')) {
            const group = choices[i] as ChoiceGroupItem
            if (group.name.trim().length === 0) {
                throw {
                    id: 'error_template_choice_field_name_empty',
                    path
                }
            }
            if (set.has(group.name)) {
                throw {
                    id: 'error_template_choice_field_name_conflict',
                    path
                }
            }
            set.add(group.name);
            if (!checkArray(group.items as string[], set)) {
                throw {
                    id: 'error_template_choice_field_name_conflict',
                    path
                }
            }
            misc.grp.push((choices[i] as ChoiceGroupItem));
        }
        else {
            const name = choices[i] as string;
            if (name.trim().length === 0) {
                throw {
                    id: 'error_template_choice_field_name_empty',
                    path
                }
            }
            if (set.has(name)) {
                throw {
                    id: 'error_template_choice_field_name_conflict',
                    path
                }
            }
            set.add(name);
            misc.opt.push(choices[i] as string);
        }

    }
    return misc;
}

export function FieldToRawField(field: AnyField, path: number[]): RawField {

    const result: any = {
        r: field.required,
        t: field.type,
        misc: {},
    }
    
    if ((field.title.indexOf('.') !== -1)||(field.title.indexOf('$') === 0)) {
        throw {
            id: 'error_template_field_title_error_prefix',
            path,
        };
    }

    switch (field.type) {
    case FieldType.String: {
        break;
    }
    case FieldType.Number: {
        result.misc.unit = field.unit;
        break;
    }
    case FieldType.Range: {
        result.misc.type = field.subType;
        result.misc.unit = field.unit;
        break;
    }
    case FieldType.Image: {
        result.misc.multi = field.allowMulti;
        break;
    }
    case FieldType.File: {
        result.misc.multi = field.allowMulti;
        break;
    }
    case FieldType.Choice: {
        result.misc = ChoiceItemToRawChoiceItem(field.choices, path);
        break;
    }
    case FieldType.Array: {
        if (field.children.length !== 1) {
            throw {
                id: 'error_template_array_no_content',
                path,
            };
        }
        result.misc = FieldToRawField(field.children[0], [...path, 0]);
        break;
    }
    case FieldType.Table: {
        const set = new Set();
        if (field.children.length === 0) {
            throw { id: 'error_template_table_no_content', path }
        }
        const head: string[] = [];
        for (let i = 0; i < field.children.length; ++i) {
            const title = field.children[i].title;
            if (title.trim().length === 0) {
                throw { id: 'error_template_field_name_empty', path: path }
            }
            if (set.has(title)) {
                throw { id: 'error_template_table_field_name_conflict', name: title, path: [...path, i] };
            }
            set.add(field.children[i].title);
            head.push(title);
            result.misc[title] = FieldToRawField(field.children[i], [...path, i]);
        }
        result.misc._head = head;
        break;
    }
    case FieldType.Container: {
        const set = new Set();
        if (field.children.length === 0) {
            throw { id: 'error_template_container_no_content', path }
        }
        const order: string[] = [];
        for (let i = 0; i < field.children.length; ++i) {
            const title = field.children[i].title;
            if (title.trim().length === 0) {
                throw { id: 'error_template_field_name_empty', path }
            }
            if (set.has(title)) {
                throw { 
                    id: 'error_template_container_field_name_conflict',
                    name: title,
                    path: [...path, i],
                };
            }
            set.add(field.children[i].title);
            order.push(title);
            result.misc[title] = FieldToRawField(field.children[i], [...path, i]);
        }
        result.misc._ord = order;
        break;
    }
    case FieldType.Generator: {
        const set = new Set();
        if (field.children.length === 0) {
            throw { id: 'error_template_generator_no_content', path }
        }
        const opt: string[] = [];
        for (let i = 0; i < field.children.length; ++i) {
            const title = field.children[i].title;
            if (title.trim().length === 0) {
                throw { id: 'error_template_field_name_empty', path }
            }
            if (set.has(title)) {
                throw { 
                    id: 'error_template_generator_field_name_conflict',
                    name: title,
                    path: [...path, i],
                };
            }
            set.add(field.children[i].title);
            opt.push(title);
            result.misc[title] = FieldToRawField(field.children[i], [...path, i]);
        }
        result.misc._opt = opt;
        break;
    }
    }

    return result as RawField;
}

export function TemplateToRawTemplate(template: AnyField[]): any {
    const container: ContainerField = {
        title: '',
        required: false,
        children: template,
        type: FieldType.Container
    }
    return FieldToRawField(container, []).misc;
}

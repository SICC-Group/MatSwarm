import React, { FC, useState, useEffect } from 'react';
import { Tree } from 'antd';
import { Template } from '../../apis/define/Template';
import { GetTemplate } from '../../apis/template/Get';
import { AnyField } from '../../apis/define/Field';
import { FieldType } from '../../apis/define/FieldType';
import { FieldTypeTag } from './FieldTypeTag';

const {TreeNode} = Tree;

// 渲染设置
// 作用优先级：disable > allow (拒绝大于允许)
interface RenderConfig {
    // 是否在字段名称右侧展示字段的类型
    showFieldType?: boolean;

    // 允许被选中的字段
    // 为true表示允许任何字段被选中
    allowChecked: FieldType[] | true;

    // 哪些组合字段需要渲染子节点
    // 为true表示任意组合字段都可以渲染子节点
    allowChildren?: FieldType.Composite[] | boolean;

    // 是否渲染数组的子节点
    allowArrayContent?: boolean;

    // // 是否渲染生成器的子节点
    // showGeneratorChildren?: boolean;

    // // 是否渲染表格的子节点
    // showTableChildren?: boolean;

    // // 是否选数组的内容
    // showArrayContent?: boolean;
}

export interface Props extends RenderConfig {
    mergeChecked?: boolean;
    style?: React.CSSProperties;
    // 选中的字段
    checkedFields: Array<string>;
    template: Template.Content;
    onChange: (checked: Array<string>) => void;
}

function MyContains<T>(arr: T[] | boolean | null | undefined, item: T) {
    if (arr === null || arr === undefined || arr === false) {
        return false;
    }
    else if (arr === true) { 
        return true; 
    }
    else {
        return (arr as T[]).includes(item);
    }
}

function FieldToTreeNode(parents: Set<string>, config: RenderConfig, field: AnyField, path: string[], isArrayContent?: boolean) {
    const key = (isArrayContent ? [...path, '0',] : [...path, field.title]).join('.');
    const childPath = isArrayContent ? [...path, '0'] : [...path, field.title];

    let content: React.ReactNode = null;

    if (FieldType.isPrimitive(field.type)) {
        // do nothing
    }
    else if (field.type === FieldType.Array && config.allowArrayContent){
        parents.add(key);
        const child = { ...field.children[0]}
        content = [child].map(value => FieldToTreeNode(parents, config, value, childPath, true))
    }
    else {
        // 必然是复合字段
        if (field.type === FieldType.Container && MyContains(config.allowChildren, FieldType.Container)) {
            parents.add(key);
            content = field.children.map(value => FieldToTreeNode(parents, config, value, childPath))
        }
        else if (field.type === FieldType.Table && MyContains(config.allowChildren, FieldType.Table)) {
            parents.add(key);
            content = field.children.map(value => FieldToTreeNode(parents, config, value, childPath))
        }
        else if (field.type === FieldType.Generator && MyContains(config.allowChildren, FieldType.Generator)) {
            parents.add(key);
            content = field.children.map(value => FieldToTreeNode(parents, config, value, childPath))
        }
    }

    // 标题
    let displayName: React.ReactNode = isArrayContent ? '数组内容' : field.title;
    if (config.showFieldType){
        displayName = (
            <span>
            <span style={{marginRight: '5px'}}>{displayName}</span>
            <FieldTypeTag type={field.type} />
            </span>
        )
    }
    // 是否禁用选中
    const disabled = (!(config.allowChecked === true) && !(config.allowChecked.includes(field.type)));

    return (
        <TreeNode  key={key} disabled={disabled} title={displayName}>
            {content}
        </TreeNode>
    )
}

function MergeChecked(checked: string[]): string[] {
    if (checked.length === 0) return [];
    let sorted = checked.sort();
    let current = sorted[0];
    let index = 1;
    const result: string[] = [current];
    while (index < checked.length) {
        const find = checked[index].indexOf(current);
        if (find === 0 && checked[index][current.length] === '.') {
            index += 1;
        }
        else {
            current = checked[index];
            index += 1;
            result.push(current);
        }
    }
    return result;
}

export const TemplateFieldTree: FC<Props> = (props) => {

    const parents = new Set<string>();
    const nodes = props.template.map(value => FieldToTreeNode(parents, { 
        ...props
    }, value, []));

    const handleTreeOnCheck = (checked: string[]) => {
        if (props.mergeChecked) {
            props.onChange(MergeChecked(checked))
        }
        else {
            props.onChange(checked);
        }
    }

    return (
        <Tree style={props.style}
            expandedKeys={Array.from(parents)}
            onCheck={handleTreeOnCheck}
            checkable selectable={false}
              defaultExpandAll={true}
            checkedKeys={props.checkedFields}>
            {nodes}
        </Tree>
    )
}

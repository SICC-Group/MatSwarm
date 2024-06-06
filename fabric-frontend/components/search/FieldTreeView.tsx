import React, { FC, useState, useEffect } from 'react';
import { Tree, Button } from 'antd';
import { TemplateFieldTree } from '../common/TemplateFieldTree';
import { Template } from '../../apis/define/Template';
import { GetTemplate } from '../../apis/template/Get';
import { FieldType } from '../../apis/define/FieldType';
import { FormattedMessage } from 'react-intl';

const TreeNode = Tree.TreeNode;

export interface Props {
    templateID: number;
    onCommit: (meta: string[], data: string[], template: Template.Content) => void;
}

const metaData: Array<{ name: any, field: string }> = [
    { name: <FormattedMessage id='data:title' defaultMessage='标题' />, field: 'title' },
    { name: <FormattedMessage id='author' defaultMessage='作者' />, field: 'realname' },
    { name: <FormattedMessage id='data:abstract' defaultMessage='摘要' />, field: 'abstract' },
    { name: 'DOI', field: 'doi' },
    { name: <FormattedMessage id='data:project' defaultMessage='项目' />, field: 'project' },
    { name: <FormattedMessage id='dataShow:reference' defaultMessage='引用' />, field: 'reference' },
    { name: <FormattedMessage id='data:subject' defaultMessage='课题' />, field: 'subject' },
    // { name: '方法', field: 'methods' },
]

export const FieldTreeView: FC<Props> = (props) => {
    const [checkedMeta, setCheckedMeta] = useState<string[]>(['title', 'realname', 'abstract', 'doi', 'project', 'reference', 'subject']);
    const [checkedFields, setCheckedFields] = useState<string[]>([]);
    const [template, setTemplate] = useState<Template.Content>([]);

    const handleMetaDataCheck = (keys: string[]) => {
        if (keys.indexOf('title') == -1) {
            keys.push('title');
        }
        setCheckedMeta(keys);
    }

    const handleButtonClick = () => {
        props.onCommit(checkedMeta, checkedFields, template);
    }

    const handleFieldTreeChange = (checked: Array<string>) => {
        setCheckedFields(checked);
    }

    useEffect(() => {
        GetTemplate(props.templateID).then(value => {
            setTemplate(value.content);
            setCheckedFields([]);
        })
    }, [props.templateID]);

    return (
        <div>
            <div style={{height: '440px', overflowY: 'scroll'}}>
                元数据：
                <Tree
                    checkedKeys={checkedMeta}
                    checkable
                    onCheck={handleMetaDataCheck}>
                    {metaData.map((value) => (
                        <TreeNode title={value.name} key={value.field} />
                    ))}
                </Tree>
                模板字段：
                <TemplateFieldTree 
                    allowChecked={[FieldType.String, FieldType.Number, FieldType.Range, FieldType.Choice]}
                    allowChildren={[FieldType.Container]}
                    template={template}
                    onChange={handleFieldTreeChange}
                    checkedFields={checkedFields} />
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0', height: '40px', borderTop: '1px solid #E9E9E9' }}>
                <Button size='small' onClick={handleButtonClick}>提交</Button>
            </div>
        </div>
    )
}

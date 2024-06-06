import React, { FC } from 'react';
import { Input } from 'antd';

import { EditableTitle } from './EditableTitle';
import { CategoryTree } from '../common/CategoryTree';
import './TemplateInfo.less';

import { FormattedMessage } from 'react-intl';
import { MethodTree } from '../common/MethodTree';

const { TextArea } = Input;

interface Props {
    title: string;
    onTitleChange: (value: string) => void;

    desc: string;
    onDescChange: (value: string) => void;

    categoryID: number;
    onCategoryIDChange: (value: number) => void;

    method: number | undefined;
    onMethodChange: (value: number | undefined) => void;
    is_tem:boolean;
}

export const TemplateInfoEdit: FC<Props> = (props) => {

    const handleTextAreaOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.onDescChange(event.target.value);
    };

    return (
        <div className='TemplateInfo'>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <EditableTitle value={props.title} onChange={props.onTitleChange} is_tem={props.is_tem}/>
            </div>
            <CategoryTree className='TemplateInfo__CategoryTree' value={props.categoryID} onChange={props.onCategoryIDChange} disable={true} />
            <MethodTree className='TemplateInfo__MethodTree' value={props.method} onChange={props.onMethodChange}  disable={!props.is_tem}/>

            <FormattedMessage id='template:input_template_desc' defaultMessage='摘要信息（必填）'>
                {(msg) => (
                    <TextArea value={props.desc} onChange={handleTextAreaOnChange} className='TemplateInfo__TextArea' rows={4} placeholder={msg as string} disabled={!props.is_tem}/>
                )}
            </FormattedMessage>
        </div>
    );
};

import React, { FC } from 'react';
import { Input } from 'antd';

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
}

export const TemplateInfoCheck: FC<Props> = (props) => {

    const handleTextAreaOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.onDescChange(event.target.value);
    };

    return (
        <div className='TemplateInfo'>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <h1>{props.title}</h1>
            </div>
            <CategoryTree className='TemplateInfo__CategoryTree' value={props.categoryID} onChange={props.onCategoryIDChange} disable={true} />
            <MethodTree className='TemplateInfo__MethodTree' value={props.method} onChange={props.onMethodChange} disable={true} />

            <FormattedMessage id='template:input_template_desc' defaultMessage='摘要信息（必填）'>
                {(msg) => (
                    <TextArea value={props.desc} onChange={handleTextAreaOnChange} className='TemplateInfo__TextArea' rows={4} placeholder={msg as string} readOnly/>
                )}
            </FormattedMessage>
        </div>
    );
};

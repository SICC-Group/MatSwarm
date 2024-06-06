import React, { FC } from 'react';
import { Input, Button, Icon, Upload } from 'antd';

import { EditableTitle } from './EditableTitle';
import { CategoryTree } from '../common/CategoryTree';
import './TemplateInfo.less';

import { FormattedMessage } from 'react-intl';
import { MethodTree } from '../common/MethodTree';
import ButtonGroup from 'antd/lib/button/button-group';

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

    onLoadClick: () => void;
    onImport: (tem: any) => void;
    setName?: (label: string) => void;
    is_tem:boolean;
}

export const TemplateInfo: FC<Props> = (props) => {

    const handleTextAreaOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.onDescChange(event.target.value);
    };

    const onImportTemplate = (file: any) => {
        const files = file.target.files;
        let selectedFile = files[0];//获取读取的File对象
        let reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function () {
            let tem = JSON.parse(this.result.toString());
            props.onImport(tem);
        };
    };

    return (
        <div className='TemplateInfo'>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <EditableTitle value={props.title} onChange={props.onTitleChange} is_tem={props.is_tem}/>
                <div style={{ flexGrow: 1 }}>
                    <ButtonGroup>                        
                        <Button className='upload-wrap'>
                            <Icon type='upload' />
                            <input className='file-uploader' type='file' accept='.json' onChange={onImportTemplate} />
                            <span className='upload-text'><FormattedMessage id='template:import_client' defaultMessage='导入客户端模板'/></span>
                        </Button>
                        <Button onClick={props.onLoadClick}><FormattedMessage id='template:import_existing' defaultMessage='导入现有模板'/></Button>
                    </ButtonGroup>
                    <p className='upload-tip'><FormattedMessage id='template:attention' defaultMessage='客户端模板注意标题'/></p>
                </div>
            </div>
            {/* <CategoryTree className='TemplateInfo__CategoryTree' setName={props.setName} value={props.categoryID} onChange={props.onCategoryIDChange} disable={!props.is_tem}/>
            <MethodTree className='TemplateInfo__MethodTree' value={props.method} onChange={props.onMethodChange} category={props.categoryID} disable={!props.is_tem}/> */}
            
            <FormattedMessage id='template:input_template_desc' defaultMessage='摘要信息（必填）'>
                {(msg) => (
                    <TextArea value={props.desc} onChange={handleTextAreaOnChange} className='TemplateInfo__TextArea' rows={4} placeholder={msg as string} disabled={!props.is_tem}/>
                )}
            </FormattedMessage>
        </div>
    );
};

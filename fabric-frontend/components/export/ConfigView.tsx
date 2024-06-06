import React, { FC, useState, useEffect } from 'react';
import { Export } from '../../apis/define/Export';
import {Button, Radio, Checkbox, Divider} from 'antd';

import './ConfigView.less';
import { Template } from '../../apis/define/Template';
import { GetTemplate } from '../../apis/template/Get';
import { TemplateFieldTree } from '../common/TemplateFieldTree';
import { FlexLoading } from '../common/FlexLoading';
import {FormattedMessage} from "react-intl";

export interface Config {
    // 导出目标。可能是文件或者OCPMDM
    target: Export.Target;
    // 文件类型
    fileType: Export.FileType;
    // 是否是二维平铺导出
    isFlat?: boolean;
    // 是否分字段导出
    isPartial?: boolean;
    // 单个模板、分字段导出的情况下需要导出的路径
    fieldPath?: string[];
}

export interface Props {

    // 是否选中了多个模板
    singleTemplate: boolean;
    // 单个模板的ID
    templateID: number | null;

    // 点击导出按钮后调用此方法
    onExportClick: (config: Config) => void;
    onSjgClick:()=>void;
    loading?: boolean;
    selected ?:[]
}

export const ConfigView: FC<Props> = (props) => {

    const [target, setTarget] = useState(Export.Target.File);
    const [fileType, setFileType] = useState(Export.FileType.Excel);
    const [flat, setFlat] = useState(false);
    const [partial, setPartial] = useState(false);

    const [templateContent, setTemplateContent] = useState<Template.Content | null>(null);
    const [checkedFields, setCheckedFields] = useState<string[] | null>(null);

    useEffect(() => {
        console.log(props.singleTemplate);
        if (!props.singleTemplate) {
            setTarget(Export.Target.File);
            setPartial(false);
            setFlat(false);
        }
    }, [props.singleTemplate])
    useEffect(() => {
        setCheckedFields(null);
        if (props.templateID != null) {
            setTemplateContent(null);
            setCheckedFields([]);
            GetTemplate(props.templateID).then((value) => {
                setTemplateContent(value.content);
            });
        }
    }, [props.templateID]);

    const handleSetPartial = (value: boolean) => {
        setPartial(value);
    }

    const handleCheckedFieldsChange = (value: string[]) => {
        setCheckedFields(value);
    }

    const handleButtonClick = () => {
        if (partial){
            if (checkedFields == null) return;
            else if (checkedFields.length === 0) return;
        }
        props.onExportClick({
            target,
            fileType,
            isFlat: flat,
            isPartial: partial,
            // TODO
            fieldPath: checkedFields,
        });
    }
    const handleSJGClick = () => {
        if (partial){
            if (checkedFields == null) return;
            else if (checkedFields.length === 0) return;
        }
        props.onSjgClick();
    }

    const handleTargetChange = (newTarget: Export.Target) => {
        setTarget(newTarget);
        if (newTarget === Export.Target.OCPMDM) {
            if (fileType === Export.FileType.Excel || fileType === Export.FileType.XML) {
                setFileType(Export.FileType.JSON);
            }
            setFlat(true);
            setPartial(true);
        }
    }

    return (
        <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
            <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <div className='ConfigView__header'><FormattedMessage id='export:form' defaultMessage='导出形式' /></div>
                <div className='ConfigView__body'>
                    <Radio.Group value={target} 
                        buttonStyle="solid" onChange={(e) => handleTargetChange(e.target.value)}>
                        <Radio.Button value={Export.Target.File}><FormattedMessage id='export:file' defaultMessage='文件' /></Radio.Button>
                        {/* <Radio.Button value={Export.Target.OCPMDM} disabled={!props.singleTemplate}>OCPMDM</Radio.Button> */}
                    </Radio.Group>
                </div>
                <div className='ConfigView__header'><FormattedMessage id='export:file_format' defaultMessage='文件格式' /></div>
                <div className='ConfigView__body'>
                    <Radio.Group value={fileType} buttonStyle="solid" onChange={(e) => setFileType(e.target.value)}>
                        <Radio.Button 
                            disabled={target === Export.Target.OCPMDM}
                            value={Export.FileType.Excel}>Excel</Radio.Button>
                        <Radio.Button value={Export.FileType.JSON}>JSON</Radio.Button>
                        <Radio.Button 
                            disabled={target === Export.Target.OCPMDM || flat}
                            value={Export.FileType.XML}>XML</Radio.Button>
                        <Radio.Button value={Export.FileType.CSV}>CSV</Radio.Button>
                    </Radio.Group>
                </div>
                <div className='ConfigView__header'><FormattedMessage id='export:other' defaultMessage='其它选项'/></div>
                <div className='ConfigView__body'>
                    <Checkbox 
                        disabled={target === Export.Target.OCPMDM || !props.singleTemplate}
                        onChange={(e) => setFlat(e.target.checked)} 
                        checked={flat}><FormattedMessage id='export:2d' defaultMessage='二维平铺'/></Checkbox>
                    <Checkbox 
                        disabled={target === Export.Target.OCPMDM || !props.singleTemplate}
                        onChange={(e) => handleSetPartial(e.target.checked)} 
                        checked={partial}><FormattedMessage id='export:by_field' defaultMessage='分字段导出'/></Checkbox>
                </div>
                {
                    partial && props.templateID != null ? (
                        <div className='ConfigView__header'><FormattedMessage id='export:select_field' defaultMessage='选择字段' /></div>
                    ) : null
                }
                {
                    partial && props.templateID != null ? (
                        <div className='ConfigView__body' style={{textAlign: 'left'}}>
                            {
                                templateContent == null ? <FlexLoading /> : (
                                <TemplateFieldTree
                                style={{maxHeight: '480px', overflowY: 'scroll'}}
                                allowArrayContent
                                mergeChecked
                                allowChecked={true} showFieldType allowChildren
                                onChange={handleCheckedFieldsChange}
                                template={templateContent}
                                checkedFields={checkedFields}/>
                                )
                            }
                            
                        </div>
                    ) : null
                }
            </div>
            <div style={{ textAlign: 'center', margin: '8px' }}>
                <Button type='primary' size='large' style={{ width: '240px' }} 
                    loading={props.loading}
                    disabled={props.loading}
                    onClick={handleButtonClick}><FormattedMessage id='export' defaultMessage='导出' /></Button>
                <Divider type='vertical' />
                <Divider type='vertical' />
                <Button type='primary' size='large' style={{ width: '240px' }}
                    loading={props.loading}
                    disabled={props.loading}
                    onClick={handleSJGClick}><FormattedMessage id='export:data_view' defaultMessage='数据观' /></Button>

            </div>
        </div>
    )
}

import React, { FC, useState, useEffect } from 'react';
import { Export } from '../../../apis/define/Export';
import {Button, Radio, Checkbox, Divider} from 'antd';

import './ConfigView.less';
import { Template } from '../../../apis/define/Template';
import { GetTemplate } from '../../../apis/template/Get';
import { TemplateFieldTree } from '../../common/TemplateFieldTree';
import { FlexLoading } from '../../common/FlexLoading';
import {PathModal} from './PathModal';


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
    selected ?:[];
    token ?: string;
}

export const ConfigView: FC<Props> = (props) => {

    const [target, setTarget] = useState(Export.Target.File);
    const [fileType, setFileType] = useState(Export.FileType.Excel);
    const [flat, setFlat] = useState(false);
    const [partial, setPartial] = useState(false);

    const [templateContent, setTemplateContent] = useState<Template.Content | null>(null);
    const [checkedFields, setCheckedFields] = useState<string[] | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
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
    const handleSave_20 = () => {
       setModalVisible(true);
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
            <div style={{ textAlign: 'center', margin: '8px' }}>
                {/*<Button type='primary' size='large' style={{ width: '240px' }} */}
                {/*    loading={props.loading}*/}
                {/*    disabled={props.loading}*/}
                {/*    onClick={handleButtonClick}>导出</Button>*/}
                {/*<Divider type='vertical' />*/}
                <Button type='primary' size='large' style={{ width: '180px',marginRight:'20px' }}
                    loading={props.loading}
                    disabled={props.loading}
                    onClick={handleSave_20}>保存到用户空间</Button>
                <Button type='primary' size='large' style={{ width: '180px' }}
                href='../search_20/' 
                > 返回搜索页面</Button>
            </div>
            <PathModal visible={modalVisible} onCancel={()=>{setModalVisible(false)}} token={props.token}/>
        </div>
    )
}

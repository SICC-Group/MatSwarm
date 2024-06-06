import React, { FC } from 'react';
import { Switch } from 'antd';
import { ContentProps } from './ContentProps';
import { FileField } from '../../../../apis/define/Field';

import { FormattedMessage } from 'react-intl';

export const FileContentView: FC<ContentProps<FileField>> = (props) => {

    const handleSwitch = (value: boolean) => {
        props.field.allowMulti = value;
        props.informUpdate();
    }

    return (
        <div style={{textAlign: 'center'}}>
            <i className="material-icons" style={{fontSize: '48px'}}>insert_drive_file</i>
            <br/>
            <Switch checked={props.field.allowMulti} onChange={handleSwitch}/>
            &nbsp;&nbsp;
            <FormattedMessage id='allow_multiple_files' defaultMessage='允许多个文件'/>
        </div>
    )
}

export const File: FC<ContentProps<FileField>> = (props) => {
    return (
        <div style={{textAlign: 'center'}}>
            <i className="material-icons" style={{fontSize: '48px'}}>insert_drive_file</i>
            <br/>
            <Switch checked={props.field.allowMulti} disabled/>
            &nbsp;&nbsp;
            <FormattedMessage id='allow_multiple_files' defaultMessage='允许多个文件'/>
        </div>
    )
}

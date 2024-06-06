import React, { FC } from 'react';
import { Switch } from 'antd';
import { ContentProps } from './ContentProps';
import { ImageField } from '../../../../apis/define/Field';

import { FormattedMessage } from 'react-intl';

export const ImageContentView: FC<ContentProps<ImageField>> = (props) => {

    const handleSwitch = (value: boolean) => {
        props.field.allowMulti = value;
        props.informUpdate();
    }

    return (
        <div style={{textAlign: 'center'}}>
            <i className="material-icons" style={{fontSize: '48px'}}>insert_photo</i>
            <br/>
            <Switch checked={props.field.allowMulti} onChange={handleSwitch}/>
            &nbsp;&nbsp;
            <FormattedMessage id='allow_multiple_images' defaultMessage='允许多张图片'/>
        </div>
    )
}

export const Image: FC<ContentProps<ImageField>> = (props) => {

    return (
        <div style={{textAlign: 'center'}}>
            <i className="material-icons" style={{fontSize: '48px'}}>insert_photo</i>
            <br/>
            <Switch checked={props.field.allowMulti} disabled/>
            &nbsp;&nbsp;
            <FormattedMessage id='allow_multiple_images' defaultMessage='允许多张图片'/>
        </div>
    )
}

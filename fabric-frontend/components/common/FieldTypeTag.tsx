import React, { FC } from 'react';
import { FieldType } from '../../apis/define/FieldType';
import { Tag } from 'antd';
import { FormattedMessage } from 'react-intl';

export interface Props {
    type: FieldType;
}

export const FieldTypeTag: FC<Props> = ({ type }) => {
    return (
        <Tag color="#108ee9" style={{ margin: '6px 4px 6px 0px' }}>
            <FormattedMessage id={FieldType.toMessageID(type)} />
        </Tag>
    )
}
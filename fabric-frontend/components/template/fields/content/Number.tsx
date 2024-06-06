import React, { FC, useState } from 'react';
import { ContentProps } from './ContentProps';
import { FormattedMessage } from 'react-intl';
import { NumberField } from '../../../../apis/define/Field';
import { FakeInput } from '../../common/FakeInput';
import LabelLikeInput from '../../common/LabelLikeInput';

export const NumberContentView: FC<ContentProps<NumberField>> = (props) => {

    const { field, informUpdate } = props;

    const handleUnitChange = (unit: string) => {
        field.unit = unit;
        informUpdate();
    }

    const [hover, setHover] = useState(false);

    return (
        <div style={{display: 'flex', flexDirection: 'row'}} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <FakeInput style={{marginRight: '4px'}}/>
            <FormattedMessage id='unit' defaultMessage='单位'>
                {value => {
                    return (
                        <LabelLikeInput editMode={hover}
                label={field.unit}
                placeholder={value as string} value={field.unit} onChange={handleUnitChange}/> 
                    )
                }}
            </FormattedMessage>
                       
        </div>
    )
}

export const Number: FC<ContentProps<NumberField>> = (props) => {

    const { field, informUpdate } = props;

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <FakeInput style={{marginRight: '4px'}}/>
            <FormattedMessage id='unit' defaultMessage='单位'>
                {value => {
                    return (
                        <LabelLikeInput editMode={false}
                label={field.unit}
                placeholder={value as string} value={field.unit} onChange={null}/> 
                    )
                }}
            </FormattedMessage>
                       
        </div>
    )
}

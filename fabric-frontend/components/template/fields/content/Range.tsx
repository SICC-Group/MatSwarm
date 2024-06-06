import React, { FC, useState } from 'react';
import { ContentProps } from './ContentProps';
import { FormattedMessage } from 'react-intl';
import { RangeField } from '../../../../apis/define/Field';
import { FakeInput } from '../../common/FakeInput';
import LabelLikeInput from '../../common/LabelLikeInput';

import { Radio } from 'antd';
import { RangeFieldType } from '../../../../apis/define/RangeFieldType';

export const RangeContentView: FC<ContentProps<RangeField>> = (props) => {

  const { field, informUpdate } = props;

  const handleUnitChange = (unit: string) => {
    field.unit = unit;
    informUpdate();
  }

  const handleSubTypeChange = (subType: RangeFieldType) => {
    field.subType = subType;
    informUpdate();
  }

  const [hover, setHover] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', fontSize: '18px' }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <FakeInput style={{ marginRight: '4px', width: '36px' }} />
        &nbsp;
        {field.subType === RangeFieldType.Errors ? '±': '~'}
        &nbsp;
        <FakeInput style={{ marginRight: '4px', width: '36px' }} />
        <FormattedMessage id='unit' defaultMessage='单位'>
          {value => {
            return (
              <LabelLikeInput editMode={hover}
          label={field.unit}
          placeholder={value as string} value={field.unit} onChange={handleUnitChange} />
            )
          }}
        </FormattedMessage>
        
      </div>
      <div style={{paddingTop: '4px'}}>
        <Radio.Group
        onChange={(e) => handleSubTypeChange(e.target.value)}
        value={field.subType}>
          <Radio value={RangeFieldType.Interval}>
            <FormattedMessage id='interval' defaultMessage='范围'/>
          </Radio>
          <Radio value={RangeFieldType.Errors}>
            <FormattedMessage id='errors' defaultMessage='误差'/>
          </Radio>
        </Radio.Group>
      </div>
    </div>

  )
}

export const Range: FC<ContentProps<RangeField>> = (props) => {

  const { field, informUpdate } = props;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', fontSize: '18px' }}>
        <FakeInput style={{ marginRight: '4px', width: '36px' }} />
        &nbsp;
        {field.subType === RangeFieldType.Errors ? '±': '~'}
        &nbsp;
        <FakeInput style={{ marginRight: '4px', width: '36px' }} />
        <FormattedMessage id='unit' defaultMessage='单位'>
          {value => {
            return (
              <LabelLikeInput editMode={false}
          label={field.unit}
          placeholder={value as string} value={field.unit} onChange={null} />
            )
          }}
        </FormattedMessage>
        
      </div>
    </div>

  )
}

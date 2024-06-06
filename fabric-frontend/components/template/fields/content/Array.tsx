import React, { FC } from 'react';

import { ArrayField, Create, PrimitiveField } from '../../../../apis/define/Field';
import { ContentProps } from './ContentProps';
import { FieldType } from '../../../../apis/define/FieldType';
import { FieldTypeSelect } from '../common/FieldTypeSelect';
import { FormattedMessage } from 'react-intl';
import { FieldTypeToContentView, FieldContent, FieldTypeToContentViewEdit } from './FieldTypeToContentView';

export const ArrayContentView: FC<ContentProps<ArrayField>> = (props) => {
  const { field, informUpdate, path } = props;
  const itemType = field.children.length === 0 ? null : field.children[0].type;

  const handleArrayTypeChange = (type: FieldType) => {
    field.children = [Create(type) as PrimitiveField];
    informUpdate();
  }
  const Content = (itemType === null ? null : FieldTypeToContentView(itemType));
  return (
    <div>
      <FormattedMessage id='template:array_item_type' defaultMessage='元素类型：' />
      <FieldTypeSelect value={itemType} onChange={handleArrayTypeChange} noArray />
      {
        itemType == null ? null : (
          <div style={{padding: '4px'}}>
            <Content 
              informUpdate={informUpdate}
              path={[...path, 0]}
              index={0} field={field.children[0]} 
              parent={path} onLoad={props.onLoad}/>
          </div>
        )
      }
      
    </div>
  );
}

export const Array: FC<ContentProps<ArrayField>> = (props) => {
  const { field, informUpdate, path } = props;
  const itemType = field.children.length === 0 ? null : field.children[0].type;

  const Content = (itemType === null ? null : FieldContent(itemType));
  return (
    <div>
      <FormattedMessage id='template:array_item_type' defaultMessage='元素类型：' />
      <FieldTypeSelect value={itemType} disable={true} onChange={null} noArray />
      {
        itemType == null ? null : (
          <div style={{padding: '4px'}}>
            <Content 
              informUpdate={informUpdate}
              path={[...path, 0]}
              index={0} field={field.children[0]} 
              parent={path}/>
          </div>
        )
      }
      
    </div>
  );
}

export const ArrayContentEdit: FC<ContentProps<ArrayField>> = (props) => {
  const { field, informUpdate, path } = props;
  const itemType = field.children.length === 0 ? null : field.children[0].type;

  const handleArrayTypeChange = (type: FieldType) => {
    field.children = [Create(type) as PrimitiveField];
    informUpdate();
  }
  const Content = (itemType === null ? null : FieldTypeToContentViewEdit(itemType));
  return (
    <div>
      <FormattedMessage id='template:array_item_type' defaultMessage='元素类型：' />
      <FieldTypeSelect value={itemType} onChange={handleArrayTypeChange} noArray disable={field.rawtitle}/>
      {
        itemType == null ? null : (
          <div style={{padding: '4px'}}>
            <Content 
              informUpdate={informUpdate}
              path={[...path, 0]}
              index={0} field={field.children[0]} 
              parent={path}/>
          </div>
        )
      }
      
    </div>
  );
}

import React, { FC } from 'react';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';

import { InputFieldProps } from '../Props';
import { ArrayField } from '../../../../apis/define/Field';
import { FieldTypeToContentView } from './render';


export const ArrayInputFieldContent: FC<InputFieldProps<ArrayField>> = (props) => {
  const { parent, name, informUpdate, field } = props;

  const object = (parent[name] as any[]) || [];
  const View = FieldTypeToContentView(field.children[0].type);
  const informParentUpdate = () => {
    parent[name] = object;
    informUpdate();
  }
  const handleAppend = () => {
    object[object.length] = undefined;
    informParentUpdate();
  }

  const handleDelete = (index: number) => {
    object.splice(index, 1);
    informParentUpdate();
  }

  return (
    <div>
      <div>
        {
          object.map((value, index, array) => {
            return (
              <div key={index} style={{display: 'flex',
                padding: '4px 0',
                flexDirection: 'row'}}>
                <div style={{
                  borderRight: '1px solid #D9D9D9',
                  padding: '8px', flexDirection: 'row',
                  display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <div style={{height: '24px'}}>
                    <i className='material-icons' style={{cursor: 'pointer'}}
                      onClick={() => handleDelete(index)}>clear
                    </i>
                  </div>
                  <div>
                    #{index + 1}
                  </div>
                </div>
                <div style={{padding: '8px', overflow: 'scroll' }}>
                  <View parent={object} name={`${index}`}
                    informUpdate={informParentUpdate} 
                    field={field.children[0]}/>
                </div>
              </div>
            )
          })
        }
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button type='primary' onClick={handleAppend}
          size='small'>
          <FormattedMessage id='data:add_new_item' defaultMessage='添加一项'/>
        </Button>
      </div>
    </div>
 
 )
}

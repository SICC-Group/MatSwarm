import React, { FC } from 'react';
import { Table, Button } from 'antd';

import { InputFieldProps } from '../Props';
import { TableField } from '../../../../apis/define/Field';
import { FieldTypeToContentView } from './render';
import { FormattedMessage } from 'react-intl';

import './Table.less';
const { Column } = Table;

export const TableInputFieldContent: FC<InputFieldProps<TableField>> = (props) => {

  const { parent, name, informUpdate, field } = props;

  const data: any[] = parent[name] || [];
  console.log(data);
  
  const informParentUpdate = () => {
    parent[name] = data;
    informUpdate();
  }

  const handleAppend = () => {
    data.push({});
    informParentUpdate();
  }
  const handleDelete = (index: number) => {
    data.splice(index, 1);
    informParentUpdate();
  }

  const dataWithKey = data.map((value, index) => {
    const newValue = {...value};
    newValue.key = index;
    return newValue;
  })

  return (
    <div>
      <Table dataSource={dataWithKey} pagination={false} style={{overflowY: 'scroll'}}>
        <Column title='' key='_delete_action' render={(text, record, index) => {
          return (
            <i className='material-icons' style={{cursor: 'pointer'}}
                      onClick={() => handleDelete(index)}>clear
                    </i>
          )
        }}/>
        {
          field.children.map((value) => {
            return (
              <Column className='my_table_column' title={value.title} dataIndex={value.title} key={value.title} render={(text, record, index) => {
                const View = FieldTypeToContentView(value.type);
                return <View key={value.title} parent={data[index]} field={value} name={value.title} informUpdate={informParentUpdate}/>
              }}>
              </Column>
            )
          })
        }
      </Table>
      <div style={{textAlign: 'center', margin: '8px'}}>
        <Button type='primary' onClick={handleAppend}
          size='small'>
          <FormattedMessage id='data:add_new_item' defaultMessage='添加一项'/>
        </Button>
      </div>
    </div>
  )
}

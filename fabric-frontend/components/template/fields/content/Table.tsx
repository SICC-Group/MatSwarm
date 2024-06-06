import React, { FC } from 'react';
import { TableField } from '../../../../apis/define/Field';
import { ContentProps } from './ContentProps';
import { InlineDropArea } from '../../drop/InlineDropArea';
import { FieldType } from '../../../../apis/define/FieldType';
import { FieldTypeToComponent } from '../all';
import { FieldTypeToComponentEdit } from '../edit';
import { FieldCheck } from '../check';

export const TableContentView: FC<ContentProps<TableField>> = (props) => {
    const { field, path } = props;
    return (
        <>
          <div style={{ borderLeft: '1px solid #BFBFBF' }}>
          {
            field.children.map((value, childIndex, array) => {
              const View = FieldTypeToComponent(value.type);
              return (
                  <View key={childIndex} path={path.concat(childIndex)}
                    field={field.children[childIndex]}
                    parent={path} index={childIndex}
                    informUpdate={props.informUpdate}
                    isFirst={childIndex === 0} isLast={childIndex === array.length - 1} />
              );
            })
          }
          </div>
          <InlineDropArea
            forbidTypes={[FieldType.Generator, FieldType.Container, FieldType.Table, FieldType.Array]}
            parent={path} index={field.children.length} large />
        </>
    );
}

export const Table: FC<ContentProps<TableField>> = (props) => {
  const { field, path } = props;
  return (
      <>
        <div style={{ borderLeft: '1px solid #BFBFBF' }}>
        {
          field.children.map((value, childIndex, array) => {
            const View = FieldCheck(value.type);
            return (
                <View key={childIndex} path={path.concat(childIndex)}
                  field={field.children[childIndex]}
                  parent={path} index={childIndex}
                  informUpdate={props.informUpdate}
                  isFirst={childIndex === 0} isLast={childIndex === array.length - 1} />
            );
          })
        }
        </div>
      </>
  );
}

export const TableContentEdit: FC<ContentProps<TableField>> = (props) => {
  const { field, path } = props;
  return (
      <>
        <div style={{ borderLeft: '1px solid #BFBFBF' }}>
        {
          field.children.map((value, childIndex, array) => {
            const View = FieldTypeToComponentEdit(value.type);
            return (
                <View key={childIndex} path={path.concat(childIndex)}
                  field={field.children[childIndex]}
                  parent={path} index={childIndex}
                  informUpdate={props.informUpdate}
                  isFirst={childIndex === 0} isLast={childIndex === array.length - 1}/>
            );
          })
        }
        </div>
        <InlineDropArea
          forbidTypes={[FieldType.Generator, FieldType.Container, FieldType.Table, FieldType.Array]}
          parent={path} index={field.children.length} large />
      </>
  );
}
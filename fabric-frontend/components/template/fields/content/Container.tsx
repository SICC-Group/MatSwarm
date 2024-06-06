import React, { FC } from 'react';
import { ContainerField } from '../../../../apis/define/Field';
import { ContentProps } from './ContentProps';
import { InlineDropArea } from '../../drop/InlineDropArea';
import { FieldTypeToComponent } from '../all';
import { FieldCheck } from '../check';
import { FieldTypeToComponentEdit } from '../edit';
export const ContainerContentView: FC<ContentProps<ContainerField>> = (props) => {
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
                    isFirst={childIndex === 0} isLast={childIndex === array.length - 1} onLoad={props.onLoad}/>
              );
            })
          }
          </div>
          <InlineDropArea
            parent={path} index={field.children.length} large onLoad={()=>props.onLoad(path)} container={true}/>
        </>
    );
}

export const Container: FC<ContentProps<ContainerField>> = (props) => {
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

export const ContainerContentEdit: FC<ContentProps<ContainerField>> = (props) => {
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
                  isFirst={childIndex === 0} isLast={childIndex === array.length - 1} />
            );
          })
        }
        </div>
        <InlineDropArea
          parent={path} index={field.children.length} large />
      </>
  );
}
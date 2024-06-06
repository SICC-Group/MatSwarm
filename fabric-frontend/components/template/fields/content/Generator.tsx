import React, { FC } from 'react';
import { ContentProps } from './ContentProps';
import { GeneratorField } from '../../../../apis/define/Field';
import { FieldTypeToComponent } from '../all';
import { InlineDropArea } from '../../drop/InlineDropArea';
import { FormattedMessage } from 'react-intl';
import { FieldType } from '../../../../apis/define/FieldType';
import { FieldCheck } from '../check';
import { FieldTypeToComponentEdit } from '../edit';


export const GeneratorContentView: FC<ContentProps<GeneratorField>> = (props) => {
  const { field, path } = props;
  return (
    <>
      <div style={{ borderLeft: '1px solid #BFBFBF' }}>
      {
        field.children.map((value, childIndex, array) => {
          const View = FieldTypeToComponent(value.type);
          return (
            <React.Fragment key={childIndex}>
              <div style={{
                marginLeft: '-8px', paddingLeft: '6px', 
                background: 'white', fontSize: '18px'}}>
                <FormattedMessage id='template:generator_option' defaultMessage='选项'/>&nbsp;{childIndex + 1}
              </div>
              <View path={path.concat(childIndex)}
                field={field.children[childIndex]}
                parent={path} index={childIndex}
                informUpdate={props.informUpdate}
                isFirst={childIndex === 0} isLast={childIndex === array.length - 1} onLoad={props.onLoad}/>
            </React.Fragment>
          );
        })
      }
      </div>
      <InlineDropArea 
        forbidTypes={[FieldType.Generator]}
        parent={path} index={field.children.length} large />
    </>
  )
}

export const Generator: FC<ContentProps<GeneratorField>> = (props) => {
  const { field, path } = props;
  return (
    <>
      <div style={{ borderLeft: '1px solid #BFBFBF' }}>
      {
        field.children.map((value, childIndex, array) => {
          const View = FieldCheck(value.type);
          return (
            <React.Fragment key={childIndex}>
              <div style={{
                marginLeft: '-8px', paddingLeft: '6px', 
                background: 'white', fontSize: '18px'}}>
                <FormattedMessage id='template:generator_option' defaultMessage='选项'/>&nbsp;{childIndex + 1}
              </div>
              <View path={path.concat(childIndex)}
                field={field.children[childIndex]}
                parent={path} index={childIndex}
                informUpdate={props.informUpdate}
                isFirst={childIndex === 0} isLast={childIndex === array.length - 1} />
            </React.Fragment>
          );
        })
      }
      </div>
    </>
  )
}
export const GeneratorContentEdit: FC<ContentProps<GeneratorField>> = (props) => {
  const { field, path } = props;
  return (
    <>
      <div style={{ borderLeft: '1px solid #BFBFBF' }}>
      {
        field.children.map((value, childIndex, array) => {
          const View = FieldTypeToComponentEdit(value.type);
          return (
            <React.Fragment key={childIndex}>
              <div style={{
                marginLeft: '-8px', paddingLeft: '6px', 
                background: 'white', fontSize: '18px'}}>
                <FormattedMessage id='template:generator_option' defaultMessage='选项'/>&nbsp;{childIndex + 1}
              </div>
              <View path={path.concat(childIndex)}
                field={field.children[childIndex]}
                parent={path} index={childIndex}
                informUpdate={props.informUpdate}
                isFirst={childIndex === 0} isLast={childIndex === array.length - 1}/>
            </React.Fragment>
          );
        })
      }
      </div>
      <InlineDropArea 
        forbidTypes={[FieldType.Generator]}
        parent={path} index={field.children.length} large />
    </>
  )
}
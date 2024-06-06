import React, { FC, useState } from 'react';
import { Checkbox } from 'antd';
import withStyles, { WithStyles } from 'react-jss';
import { EditorContext, IEditorContext } from '../../context/EditorContext';
import { InlineDropArea } from '../../drop/InlineDropArea';
import { FormattedMessage } from 'react-intl';
import LabelLikeInput from '../../common/LabelLikeInput';
import { BaseFieldProps } from './BaseFieldProps';
import { BaseField } from '../../../../apis/define/Field';
import { FieldTypeTag } from '../../../common/FieldTypeTag';

const styles = {
  FieldBox: {
    padding: 0,
    background: '#FFF',
    paddingLeft: '18px',
  },
  TitleBase: {
    display: 'flex',
    flexDirection: 'row',
    whiteSpace: 'nowrap',
    padding: '12px 0',
    fontSize: '18px',
  },
  ContentWrapper: {
    paddingBottom: '12px',
  },
  ActionButton: {
    lineHeight: '32px',
    cursor: 'pointer',
    width: '32px',
    textAlign: 'center',
  }
}

export type FieldBoxEditProps<T extends BaseField> = BaseFieldProps<T> & WithStyles<typeof styles>

const _FieldBoxEdit: FC<FieldBoxEditProps<BaseField>> = (props) => {
  const { classes, parent, children, index, isFirst, isLast, field } = props;
  const [hover, setHover] = useState(false);
  const onMouseLeave = () => {
    setHover(false);
  }
  const onMouseEnter = () => {
    setHover(true);
  }
  const handleTitleChange = (context: IEditorContext, newTitle: string) => {
    field.title = newTitle;
    context.templateCtrl.informUpdate();
  }

  const handleRequiredChange = (context: IEditorContext, required: boolean) => {
    field.required = required;
    context.templateCtrl.informUpdate();
  }

  const handleUpdateOrder = (context: IEditorContext, newIndex: number) => {
    context.templateCtrl.updateOrder(parent, index, newIndex);
  }

  const handleDelete = (context: IEditorContext) => {
    context.templateCtrl.delete(parent, index);
  }

  return (
    <>
      <InlineDropArea parent={parent} index={index} />
      <div className={classes.FieldBox} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div className={classes.TitleBase} >
          <EditorContext.Consumer>
            {(context) => {
              return (
                <>
                  <FieldTypeTag type={field.type} />
                  <FormattedMessage id='template:fill_here' defaultMessage='字段名称'>
                    {(value) => {
                      return (
                        <LabelLikeInput value={field.title}
                          editMode={field.rawtitle?false:hover}
                          label={field.title + (field.required ? '*': '')}
                          placeholder={value as string}
                          onChange={(s) => handleTitleChange(context, s)} />
                      )
                    }}
                  </FormattedMessage>
                  
                  <div style={{display: 'flex', flex: '1', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '6px'}}>
                    {
                    (hover ? <Checkbox checked={field.required} 
                      onChange={(e) => handleRequiredChange(context, e.target.checked)}>
                        <FormattedMessage id='template:field_required' defaultMessage='必填'/>
                        </Checkbox> : null)
                    }
                    {
                      (!isFirst && hover ? <i className={`material-icons ${classes.ActionButton}`} 
                        onClick={() => handleUpdateOrder(context, index - 1)}>keyboard_arrow_up</i> : null)
                    }
                    {
                      (!isLast && hover ? <i className={`material-icons ${classes.ActionButton}`} 
                        onClick={() => handleUpdateOrder(context, index + 1)}>keyboard_arrow_down</i> : null)
                    }
                    {
                      (hover&&field.rawtitle!==true? <i className={`material-icons ${classes.ActionButton}`} 
                      onClick={() => handleDelete(context)}>clear</i> : null)
                    }
                  </div>
                </>
              )
            }}
          </EditorContext.Consumer>
        </div>
        <div className={classes.ContentWrapper}>
          {children}
        </div>
      </div>
    </>

  )
}

export const FieldBoxEdit = withStyles(styles)(_FieldBoxEdit);

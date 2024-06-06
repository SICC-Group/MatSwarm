import React, { FC, useState } from 'react';
import {Checkbox, Icon, Tag, Tooltip} from 'antd';
import withStyles, { WithStyles } from 'react-jss';

import { EditorContext, IEditorContext } from '../../context/EditorContext';
import { InlineDropArea } from '../../drop/InlineDropArea';

import { FormattedMessage } from 'react-intl';
import LabelLikeInput from '../../common/LabelLikeInput';
import { BaseFieldProps } from './BaseFieldProps';

import { FieldType } from '../../../../apis/define/FieldType';
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

export type FieldBoxProps<T extends BaseField> = BaseFieldProps<T> & WithStyles<typeof styles>

const _FieldBox: FC<FieldBoxProps<BaseField>> = (props) => {
  const { classes, parent, children, index, isFirst, isLast, field, isIdentifier} = props;
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
                  {/*对标识符字段样式进行细微更改（不可删除、必填、提示）*/}
                  <FormattedMessage id='template:fill_here' defaultMessage={isIdentifier ? '字段名称（数据特征描述字段）':'字段名称'}>
                    {(value) => {
                      return (
                          <div><LabelLikeInput value={field.title}
                          editMode={hover}
                          label={field.title + (field.required ? '*': '')}
                          placeholder={value as string}
                          onChange={(s) => handleTitleChange(context, s)} />
                          {
                          (isIdentifier?<Tooltip title="标识符，数据特征描述字段，用于模板自定义数据，必须有">
                            <Icon type="info-circle" />
                          </Tooltip>: null)
                          }
                          </div>
                      )
                    }}
                  </FormattedMessage>
                  <div style={{display: 'flex', flex: '1', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '6px'}}>
                    {
                    (hover ? <Checkbox checked={field.required} disabled={isIdentifier}
                      onChange={(e) => handleRequiredChange(context, e.target.checked)}>
                        <FormattedMessage id='template:field_required' defaultMessage='必填'/>
                        </Checkbox> : null)
                    }
                    {
                      (isIdentifier ? <Tag color='red' style={{height:'24px'}}><FormattedMessage id='template:Data_feature' defaultMessage={'数据特征描述字段'}/></Tag> : null)
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
                      (!isIdentifier && hover? <i className={`material-icons ${classes.ActionButton}`}
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

export const FieldBox = withStyles(styles)(_FieldBox);

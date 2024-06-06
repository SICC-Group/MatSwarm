import React, { FC } from 'react';
import withStyles, { WithStyles } from 'react-jss';

import { EditorContext } from '../../context/EditorContext';

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

export type FieldBoxProps<T extends BaseField> = BaseFieldProps<T> & WithStyles<typeof styles>

const _FieldBoxCheck: FC<FieldBoxProps<BaseField>> = (props) => {
    const { classes, parent, children, index, isFirst, isLast, field } = props;

    return (
        <>
            <div className={classes.FieldBox}>
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
                                                    editMode={false}
                                                    label={field.title + (field.required ? '*' : '')}
                                                    placeholder={value as string}
                                                    onChange={null} />
                                            )
                                        }}
                                    </FormattedMessage>
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

export const FieldBoxCheck = withStyles(styles)(_FieldBoxCheck);

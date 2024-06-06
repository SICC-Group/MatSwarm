import React, { FC } from 'react';
import { withDefaultProps } from '../../utils/withDefaultProps';

import { FormattedMessage } from 'react-intl';
import './EditableTitle.less';
import {CheckTemTitle} from '../../apis/template/CheckTitle';

interface DefaultProps {
    size: 'medium' | 'large';
}

const defaultProps: DefaultProps = {
    size: 'medium', 
};

type Props = { 
    value: string, onChange: (newValue: string) => void, is_tem:boolean;
} & DefaultProps;

const _EditableTitle: FC<Props> = (props) => {
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(event.target.value);
    };

    const checkTitle = () => {
        if(props.value.length > 0){
            CheckTemTitle(props.value);
        }
    }
    
    return (
        <FormattedMessage id='template:input_title' defaultMessage={props.is_tem?'点此输入模板标题':'点此输入模板片段标题'}>
          {(msg) => (
            <input className='EditableTitle__input' placeholder={msg as string} value={props.value} onChange={handleOnChange} onBlur={checkTitle}/>
          )}
        </FormattedMessage>
    );
};

export const EditableTitle = withDefaultProps(defaultProps, _EditableTitle);

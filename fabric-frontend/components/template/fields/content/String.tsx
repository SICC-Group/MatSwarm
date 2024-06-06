import React, { FC } from 'react';
import { ContentProps } from './ContentProps';
import { StringField } from '../../../../apis/define/Field';


import { FakeInput } from '../../common/FakeInput';

export const StringContentView: FC<ContentProps<StringField>> = () => {
    return (
        <FakeInput style={{width: '50%'}}/>
    )
}


export const String: FC<ContentProps<StringField>> = () => {
    return (
        <FakeInput style={{width: '50%'}}/>
    )
}
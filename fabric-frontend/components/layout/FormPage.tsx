import React, { FC } from 'react';

import { Container } from './Container';

import './FormPage.less';

export interface FormPageProps {
    className?: string;
    style?: React.CSSProperties;
    title: React.ReactNode;
}

export const FormPage: FC<FormPageProps> = (props) => (
    <Container className='FormPage'>
        <div className='FormPage__title'>
            {props.title}
        </div>
        <div className={`FormPage__content ${props.className || ''}`} style={props.style}>
            {props.children}
        </div>
    </Container>
);

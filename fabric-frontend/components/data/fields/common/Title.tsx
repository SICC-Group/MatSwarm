import React, { FC } from 'react';

export interface TitleProps {
    name: React.ReactNode;
    extra?: string;
}

export const Title: FC<TitleProps> = ({name, extra}) => {
    return (
        <div style={{fontSize: '16px', fontWeight: 'bold', margin: '8px 0'}}>
            {name}{extra}
        </div>
    )
}
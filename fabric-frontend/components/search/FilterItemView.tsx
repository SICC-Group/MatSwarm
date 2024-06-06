import React, { FC } from 'react';

export interface Props {
    title: React.ReactNode;
    value: string | number;

    onRemove: () => void;
}

export const FilterItemView: FC<Props> = (props) => {
    return (
        <div style={{display: 'inline-block'}}>
            {props.title}
        </div>
    )
}
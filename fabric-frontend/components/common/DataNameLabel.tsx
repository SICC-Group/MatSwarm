import React, { FC, useState, useEffect } from 'react';

export interface Props {
    id: number;
    name?: React.ReactNode;
}

export const DataNameLabel: FC<Props> = (props) => {
    const [name, setName] = useState<string | null>(null);

    // useEffect(() => {
    //     GetTemplateNames(props.id).then((value) => {
    //         setName(value.Get(`${props.id}`));
    //     })
    // }, [])
    return <span>{name == null ? props.id : name }</span>
}

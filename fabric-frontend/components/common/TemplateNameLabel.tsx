import React, { FC, useState, useEffect } from 'react';

import { GetTemplateNames } from '../../apis/template/GetTemplateNames';

export interface Props {
    id: number;
}

export const TemplateNameLabel: FC<Props> = (props) => {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        GetTemplateNames(props.id).then((value) => {
            setName(value.Get(`${props.id}`));
        })
    }, [])
    return <span>{name == null ? props.id : name }</span>
}

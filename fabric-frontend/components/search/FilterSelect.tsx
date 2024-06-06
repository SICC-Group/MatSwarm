import React, { FC } from 'react';
import { Popover, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

export interface ContentItem {
    title: React.ReactNode;
    key: string | number;
    count?: number;
}

export interface Props {
    title: React.ReactNode;
    allowInput?: boolean;
    content: ContentItem[];

    onAdd: (key: string | number, displayName: React.ReactNode) => void;
}

export const FilterSelect: FC<Props> = (props) => {
    
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    const handleChange = (e: RadioChangeEvent, displayName: React.ReactNode) => {
        if (e.target.checked) {
            props.onAdd(e.target.value, displayName);
        }
    }

    const content = (
        <div>
            <Radio.Group style={{height: '300px', overflow: 'auto'}}>
                {props.content.map((value) => {
                    return (
                        <Radio key={value.key} style={radioStyle} value={value.key} onChange={(e) => handleChange(e, value.title)}>
                            {value.title}
                        </Radio>
                    )
                })}
            </Radio.Group>
        </div>
    )

    return (
        <div style={{display: 'inline-block', margin: '12px 20px'}}>
            <Popover content={content} placement='bottom'>
                <div style={{cursor: 'pointer'}}>
                    {props.title}
                </div>
            </Popover>
        </div>
    )
}

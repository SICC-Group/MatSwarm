import React, { Component } from 'react';

import { Spin } from 'antd';

import './DataList.less';
export type DataProcessorType<T> = (data: T) => { value: number, title: JSX.Element | string, key: string };

export interface DataListProps<T> {
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
    data?: T[];
    processor: DataProcessorType<T>;
    maxLength?: number;
    sorter?: (a: T, b: T) => number;
    onItemClick?: (key: string) => void;
}

function ItemToDiv<T>(item: T, processor: DataProcessorType<T>, onItemClick?: (key: string) => void) {

    const {key, title, value} = processor(item);

    return (
        <div key={key} className='DataList__item' onClick={() => onItemClick(key)}>
            <div className='DataList__item__title'>
                {title}
            </div>
            <div className='DataList__item__value'>
                {value}
            </div>
        </div>
    );
}

export class DataList<T> extends Component<DataListProps<T>> {
    
    constructor(props: any) {
        super(props);
    }
    
    render() {
        const className = 'DataList ' + (this.props.className || '');

        if (this.props.loading) {
            return (
                <div className={className} style={this.props.style}>
                    <div className='DataList__spin'>
                        <Spin/>
                    </div>
                </div>
            );
        }
        else {
            let list = [...this.props.data];
            if (this.props.sorter) {
                list.sort(this.props.sorter);
            }
            if (this.props.maxLength) {
                list = list.slice(0, this.props.maxLength);
            }
            return (
                <div className={className} style={this.props.style}>
                    {list.map((value) => ItemToDiv(value, this.props.processor, this.props.onItemClick))}
                </div>
            );
        }
    }
}

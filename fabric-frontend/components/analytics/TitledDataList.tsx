import React, { Component } from 'react';

import { Spin } from 'antd';
import { autobind } from 'core-decorators';

import './TitledDataList.less';
export type ItemContentType = number | string | JSX.Element;

export interface HeaderItemType {
    content: ItemContentType;
    key: string;
}

export interface TitledDataListProps<T> {
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
    data?: T[];
    headers?: HeaderItemType[];
    maxLength?: number;
    processor: (item: T) => { content: ItemContentType[], key: string };
    onClick?: (key: string) => void;
}

export class TitledDataList<T> extends Component<TitledDataListProps<T>> {
    
    constructor(props: any) {
        super(props);
    }

    @autobind
    handleClick(key: string) {
        if (this.props.onClick) {
            this.props.onClick(key);
        }
    }
    
    render() {
        const className = 'TitledDataList ' + (this.props.className || '');

        if (this.props.loading) {
            return (
                <div className={className} style={this.props.style}>
                    <Spin/>
                </div>
            );
        }
        else {

            let data = this.props.data.map(this.props.processor);

            if (this.props.maxLength) {
                data = data.slice(0, this.props.maxLength);
            }

            return (
                <div className={className} style={this.props.style}>
                    <div className='TitledDataList__header'>
                        {this.props.headers.map((value) => {
                            return (
                                <div key={value.key} className='TitledDataList__header__item'>
                                    {value.content}
                                </div>
                            );
                        })}
                    </div>
                    <div className='TitledDataList__content'>
                        {console.log('16:12', data)}
                        {
                            data.map((value) =>
                                <div key={value.key} onClick={() => this.handleClick(value.key)} className='TitledDataList__content__item'>
                                    {
                                        value.content.map((item, i) =>
                                            <div key={`${value.key}-${i}`} className='TitledDataList__content__item__item'>
                                                {item}
                                            </div>,
                                        )
                                    }
                                </div>,
                            )
                        }
                    </div>
                </div>
            );
        }        
    }
}

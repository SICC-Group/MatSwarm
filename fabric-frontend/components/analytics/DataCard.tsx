import React, { Component } from 'react';

import { Spin, Tooltip } from 'antd';

import './DataCard.less';
export interface DataCardProps {
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
    title: string | JSX.Element;
    value?: number;
    unit?: string | JSX.Element;
    icon: string;
    desc?: React.ReactNode;
}

function NumberToString(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export class DataCard extends Component<DataCardProps> {
    
    constructor(props: any) {
        super(props);
    }
    
    render() {
        const className = 'DataCard ' + (this.props.className || '');
        let content: JSX.Element = null;
        if (this.props.loading) {
            content = (
                <Spin />
            );
        }
        else {
            content = (
                <>
                    <img className='DataCard__icon' src={this.props.icon}/>
                    <div className='DataCard__content'>
                        <div className='DataCard__content__title'>{this.props.title}</div>
                        <div className='DataCard__content__value'>{NumberToString(this.props.value)}</div>
                    </div>
                    <span className='DataCard__unit'>{this.props.unit}</span>
                </>
            );
        }

        let desc: JSX.Element = null;
        if (this.props.desc != null) {
            desc = (
                <Tooltip title={this.props.desc} placement='bottom'>
                    <i className="fa fa-question-circle" 
                        style={{display: 'block', position: 'absolute', right: '4px', top: '4px'}}
                        aria-hidden="true"></i>
                </Tooltip>
            )
        }
        const style = {...this.props.style}
        style.position = 'relative';
        return (
            <div className={className} style={style}>
                {desc}
                {content}
            </div>
        );
    }
}

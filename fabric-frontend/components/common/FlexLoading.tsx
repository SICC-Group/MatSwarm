import React, { Component } from 'react';

import { Spin } from 'antd';

import './FlexLoading.less';

export interface FlexLoadingProps {
    className?: string;
    style?: React.CSSProperties;
}

export class FlexLoading extends Component<FlexLoadingProps> {
    
    constructor(props: any) {
        super(props);
    }
    
    render() {
        const className = 'FlexLoading ' + (this.props.className || '');

        return (
            <div className={className} style={this.props.style}>
                <Spin/>
            </div>
        );
    }
}

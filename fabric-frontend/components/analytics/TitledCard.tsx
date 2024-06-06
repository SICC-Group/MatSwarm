import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import './TitledCard.less';

export interface TitledCardProps {
    className?: string;
    style?: React.CSSProperties;
    title: string | JSX.Element;
    detail?: boolean;
    onDetailClick?: () => void;
}

export class TitledCard extends Component<TitledCardProps> {
    
    constructor(props: any) {
        super(props);
    }
    
    render() {
        const className = 'TitledCard ' + (this.props.className || '');

        const detail: JSX.Element = (
            this.props.detail ? 
                <div className='TitledCard__header__detail' onClick={this.props.onDetailClick}>
                    <FormattedMessage id='detail' defaultMessage='详情'/>
                </div> : null
        );

        return (
            <div className={className} style={this.props.style}>
                <div className='TitledCard__header'>
                    <div className='TitledCard__header__title'>
                        {this.props.title}
                    </div>
                    {detail}
                </div>
                <div className='TitledCard__content'>
                    {this.props.children}
                    
                </div>
            </div>
        );
    }
}

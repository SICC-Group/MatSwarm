import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { autobind } from 'core-decorators';

import Urls from '../../apis/Urls';
import searchIcon from '../../img/search.png';
import './NavSearch.less';

interface NavSearchProps {
    className?: string;
    style?: React.CSSProperties;
}

export class NavSearch extends Component<NavSearchProps> {

    constructor(props: any) {
        super(props);
    }

    @autobind
    handleClick() {
        window.location.href = Urls.search.index;
    }

    render() {
        return (
            <div className='nav-search' onClick={this.handleClick}>
                <img src={searchIcon} />
                <span><FormattedMessage id='search' defaultMessage='搜索'/></span>
            </div>
        );
    }
}

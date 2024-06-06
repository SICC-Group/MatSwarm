import React, { Component } from 'react';

import { Layout } from 'antd';

import Urls from '../../apis/Urls';
import data from '../../database_config.js';
import { LangSwitch } from './LangSwitch';
import { MgeAvatar } from './MgeAvatar';
import { NavSearch } from './NavSearch';
// const logo2 = require('../../img/logo.png');
// const logo2 = require('../../img/logo18.png');
const logo2 = require('../../img/logo_MatSwarm.png');

import './MgeHeader.less';
import {GetFrontendStatic} from "../../apis/service/FrontendStatic";


const { Header } = Layout;

interface MgeHeaderProps {
    indexOnly?: boolean;
    logo : string;
    title : string;
}


export class MgeHeader extends Component<MgeHeaderProps> {


    constructor (props: any) {
        super(props);
    }

    render() {
        const logo = this.props.indexOnly ? null : (
            <div className='mge-header__title__text'>
                <div className='material'>
                    {this.props.title}
                </div>
                <div className='mged'>
                    {data[0].name}
                </div>
            </div>
        );
        return (
            <Header style={{ display: 'flex', flexDirection: 'row', minWidth: '700px'}}>

                <a className='mge-header__title' href={Urls.search_page}>
                    <img src={logo2} style={this.props.indexOnly ? { marginTop: '-12px', height: 68, width: 'unset' } : { width: '200px' }} />
                    {/* {logo} */}
                </a>
                {this.props.children}
                <div className='mge-header__avatar'>
                    {/* {this.props.indexOnly ? null : <NavSearch />} */}
                    <LangSwitch />
                    <MgeAvatar className='mge-header__index' />
                </div>
            </Header>
        );
    }
}

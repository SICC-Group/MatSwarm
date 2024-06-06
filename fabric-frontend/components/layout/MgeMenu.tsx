import React, { Component } from 'react';

import { autobind } from 'core-decorators';

import './MgeMenu.less';
interface MenuProps {
    indexOnly?: boolean;
    className?: string;
    selected?: string;
    style?: React.CSSProperties;
}

interface MenuItemProps {
    key?: string;
    href?: string;
    overlayStyle?: React.CSSProperties;
    selected?: boolean;
    overlay?: JSX.Element;
}

interface SubMenuItemProps {
    href?: string;
    onClick?: () => void;
    count?: number;
}

export class SubMenuItem extends Component<SubMenuItemProps> {
    render() {
        const href = this.props.href || 'javascript:void(0)';
        let count: JSX.Element = null;
        if (this.props.count) {
            count = (
                <div className='nav-menu__submenu__count'>
                    {this.props.count}
                </div>
            );
        }
        return (
            <a href={href} onClick={this.props.onClick} className='nav-menu__submenu'>
                {count}
                {this.props.children}
            </a>
        );  
    }
}

export class MenuItem extends Component<MenuItemProps> {

    @autobind
    handleClick() {
        if (this.props.href) {
            window.location.href = this.props.href;
        }
    }

    render() {
        let overlayWrapper: JSX.Element = null;
        if (this.props.overlay) {
            overlayWrapper = (
                <div className='nav-menu__item__overlay' style={this.props.overlayStyle}>
                    {this.props.overlay}
                </div>
            );
        }
        return (
            <div onClick={this.handleClick} className={`nav-menu__item ${this.props.selected ? 'selected' : ''}`}>
                {this.props.children}
                {overlayWrapper}
            </div>
        );
    }
}

export class Menu extends Component<MenuProps> {
    render() {
        return (
            <div className={`nav-menu ${this.props.className || ''}`} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}

import React, { Component } from 'react';

import { autobind } from 'core-decorators';

import { CrossLine, SquareLine } from './Line';

import './Tree2.less';
interface NodeProps {
    lines: JSX.Element[];
    isFirst: boolean;
    isLast: boolean;
    isRoot: boolean;
    hasChildren: boolean;
    onClick?: () => void;
    key: string;
    title: string | JSX.Element;
    selected?: boolean;
    showLine?: boolean;
}

interface NodeState {
    expanded: boolean;
}

class Node extends Component<NodeProps, NodeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            expanded: true,
        };
    }
    
    @autobind
    handleClick(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation();
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    @autobind
    toggleChildren(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation();
        if (this.props.hasChildren) {
            this.setState({
                expanded: !this.state.expanded,
            });
        }
    }

    render() {

        // icon for node with children
        let icon: JSX.Element = null;
        if (this.props.hasChildren && this.props.showLine) {
            // icon = this.state.expanded ? minus : plus;
            icon = (
                <div className='node-prefix' onClick={this.toggleChildren}>
                    <SquareLine minus={this.state.expanded} 
                        top={!this.props.isFirst || !this.props.isRoot} bottom={!this.props.isLast}/>
                </div>
            );
        }
        else if (this.props.showLine) {
            icon = (
                <div className='node-prefix'>
                    {/* <CrossLine top={!this.props.isFirst || !this.props.isRoot} right bottom={!this.props.isLast}/> */}
                    <CrossLine top right bottom={!this.props.isLast}/>
                </div>
            );
        }
        let icon2: JSX.Element = null;
        if (this.props.hasChildren && this.props.showLine) {
            icon2 = (
                <div className='node-prefix' onClick={this.toggleChildren}>
                    <CrossLine left right bottom={this.state.expanded}/>
                </div>
            );
        }
        else if (this.props.showLine) {
            icon2 = (
                <div className='node-prefix'>
                    <CrossLine left right/>
                </div>
            );
        }

        let ul: JSX.Element = null;
        if (this.props.hasChildren && this.state.expanded) {
            ul = (
                <ul>
                    {this.props.children}
                </ul>
            );
        }

        return (
            <li className={this.props.selected ? 'selected' : null}>
                <label className='node' onClick={this.handleClick} >
                    {this.props.lines}
                    {icon}
                    {icon2}
                    <span  title={this.props.title.toString()} className='node-title'>{this.props.title}</span>
                </label>
                {ul}
            </li>
        );
    }
}

export interface TreeProps<T> {
    data: T[];

    selected?: string;

    onClick?: (key: string, name?: string | JSX.Element) => void;
    getChildren: (data: T) => T[];
    getTitle: (data: T) => JSX.Element | string;
    getKey: (data: T) => string;
    // style
    style?: React.CSSProperties;
    className?: string;
    showLine?: boolean;
}

export class Tree<T> extends Component<TreeProps<T>> {

    @autobind
    parseData(data: T[], prefix: JSX.Element[] = [], isRoot = true): JSX.Element[] {
        return data.map((value, index) => {
            const key = this.props.getKey(value);
            const title = this.props.getTitle(value);
            const children = this.props.getChildren(value);
            const hasChildren = (children && children.length !== 0);
            const isFirst = index === 0;
            const isLast = index === data.length - 1;

            let childLine: JSX.Element = null;
            if (hasChildren && this.props.showLine) {
                if (isLast) {
                    childLine = <div  key={`line-${key}`} className='node-prefix'/>;
                }
                else {
                    childLine = (
                        <div key={`line-${key}`} className='node-prefix'>
                            <CrossLine top bottom/>
                        </div>
                    );
                }
            }

            return (
                <Node
                    selected={key === this.props.selected}
                    isFirst={isFirst} isLast={isLast} isRoot={isRoot}
                    lines={prefix}
                    key={key}
                    showLine={this.props.showLine}
                    hasChildren={hasChildren} 
                    title={title} onClick={() => this.props.onClick(key, title)}>
                    { hasChildren ? this.parseData(children, [...prefix, childLine], false) : null }
                </Node>
            );
        });
    }

    render() {
        let className = 'mge-tree2';
        if (this.props.className) {
            className = `mge-tree2 ${this.props.className}`;
        }
        return (
            <ul className={className} style={this.props.style}>
                {this.parseData(this.props.data)}
            </ul>
        );
    }
}

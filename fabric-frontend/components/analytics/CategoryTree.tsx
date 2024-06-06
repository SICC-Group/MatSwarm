import React, { Component } from 'react';

import { GetCategory } from '../../apis/category/Get';
import { Category } from '../../apis/define/Category';
import { Tree } from '../tree/Tree2';

export interface CategoryTreeProps {
    onClick?: (key: string, name?: string) => void;
    selected?: string;
    style?: React.CSSProperties;
    className?: string;
}

interface State {
    data: Category[];
}

function GetChildren(data: Category) {
    return data.children;
}

function GetTitle(data: Category) {
    return data.name;
}

function GetKey(data: Category) {
    return `${data.id}`;
}

export class CategoryTree extends Component<CategoryTreeProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentWillMount() {
        GetCategory().then((value) => {
            this.setState({
                data: value,
            });
        });
    }

    render() {
        return (
            <Tree showLine style={this.props.style}
                className={this.props.className}
                selected={this.props.selected}
                getChildren={GetChildren}
                getKey={GetKey}
                getTitle={GetTitle}
                onClick={this.props.onClick}
                data={this.state.data}/>
        );
    }
}

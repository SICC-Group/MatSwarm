import React, { FC, Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { RouteComponentProps } from "react-router";

type Props = RouteComponentProps<{}>;

interface CategoryBlockProps {
    selected?: boolean;
    style?: React.CSSProperties;
    title: string | JSX.Element;
    onClick?: () => void;
}

class CategoryBlock extends Component<CategoryBlockProps> {
    render() {
        return (
            <div onClick={this.props.onClick} style={this.props.style}
                className={`category-block ${this.props.selected ? 'selected' : ''}`}>
                {this.props.title}
            </div>
        );
    }
}

const _NavMenu: FC<Props> = (props) => {

    const { pathname } = props.location;

    return (
        <div>
            <Link to='/'>
                <CategoryBlock title={'我的项目'} selected={pathname === '/'}/>
            </Link>
            <Link to='/subjects'>
                <CategoryBlock title={'我的课题'} selected={pathname.startsWith('/subjects')}/>
            </Link>
        </div>
    );
}

export const NavMenu = withRouter(_NavMenu);

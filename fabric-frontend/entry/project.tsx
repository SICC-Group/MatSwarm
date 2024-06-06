import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { HashRouter as Router, Route } from 'react-router-dom';

import { autobind } from 'core-decorators';

import Urls from '../apis/Urls';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { CategoryTree } from '../components/analytics/CategoryTree';
import { MgeLayout } from '../components/layout/MgeLayout';
import { MenuKey, NavMenu } from '../components/layout/NavMenu';
import { Overview } from '../components/project/pages/Overview';
import { SubjectList } from '../components/project/pages/SubjectList';
import { ProjectView } from '../components/project/pages/ProjectView';

import { NavMenu as LeftNav } from '../components/project/NavMenu';

import './project.less';

interface State {
    selected: string;
    name: string | JSX.Element;
}

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

const breadcrumbItems: BreadcrumbItem = 
    {
        title: <FormattedMessage id='analytics' defaultMessage='项目管理' />,
    }

const globalText = <FormattedMessage id='analytics:global' defaultMessage='全站统计' />;

class ProjectEntry extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            selected: '-1',
            name: globalText,
        };
    }

    @autobind
    handleSwitchCategory(key: string, name?: string | JSX.Element) {
        this.setState({
            selected: key,
            name,
        });
    }

    render() {
        return (
            <MgeLayout loginRequired>
                <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems]} />
                <Router>
                    <div className='project-page'>
                        <div className='project-page__left'>
                            <LeftNav />
                        </div>
                        <div className='project-page__content'>
                            <Route path='/subjects' component={SubjectList}/> {/* 我参与的课题列表（包括我负责的） */}
                            <Route path='/project/:id' component={ProjectView}/> {/* 某个项目的信息，包括它的子课题、负责人等 */}
                            <Route path='/' exact component={Overview}/> {/* 全部项目列表（我参与的、我负责的） */}
                        </div>
                    </div>
                </Router>
            </MgeLayout>
        );
    }
}

ReactDOM.render(<ProjectEntry />, document.getElementById('wrap'));

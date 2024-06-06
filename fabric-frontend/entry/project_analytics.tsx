import React, { Component } from 'react';
import { Switch } from 'antd';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';

import { autobind } from 'core-decorators';

import Urls from '../apis/Urls';
import { ProjectAnalyticsDisplay } from '../components/pages/ProjectAnalyticsDisplay';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { MgeLayout } from '../components/layout/MgeLayout';
import { MenuKey } from '../components/layout/NavMenu';
import { ProjectTree } from '../components/project/ProjectTree'

import './analytics.less';
interface State {
    selected: string;
    name: string | JSX.Element;
    display: string;
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
        title: <FormattedMessage id='analytics' defaultMessage='项目信息统计' />,
        url: Urls.search.index,
    }

const globalText = <FormattedMessage id='analytics:global' defaultMessage='全站统计' />;

class AnalyticsEntry extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            selected: 'all',
            name: globalText,
            display: 'id',
        };
    }

    @autobind
    handleSwitchProject(key: string, name?: string | JSX.Element) {
        this.setState({
            selected: key,
            name,
        });
    }

    @autobind
    changeDisplay(checked: boolean) {
        if (checked) {
            this.setState({ display: 'name' });
        }
        else {
            this.setState({ display: 'id' });
        }
    }

    render() {


        return (
            <MgeLayout reloadOnSwitchLocale selectedMenu={MenuKey.Analytics}>
                <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems]} />
                <div className='analytics'>
                    <div className='analytics__left'>
                        <CategoryBlock selected={this.state.selected === 'all'}
                            onClick={() => this.handleSwitchProject('all', globalText)}
                            style={{ borderBottom: '1px solid #5AA6C7' }} title={<FormattedMessage id='analytics:global' defaultMessage='全站统计' />} />
                        <div style={{ cursor: 'default' }}
                            className='category-block'>
                            <FormattedMessage id='analytics:project' defaultMessage='项目统计' />
                            <Switch
                                checked={this.state.display === 'name'}
                                onChange={this.changeDisplay}
                                checkedChildren="name"
                                unCheckedChildren="id"
                                style={{ marginLeft: '80px' }}
                            />
                        </div>


                        <div className='analytics__left__wrapper' style={{ background: '#236B94' }}>
                            <ProjectTree className='tree-wrapper' display={this.state.display} onClick={this.handleSwitchProject} />
                        </div>
                    </div>
                    <div className='analytics__content'>
                        <ProjectAnalyticsDisplay global={this.state.selected === 'all'} id={this.state.selected} name={this.state.name} />
                    </div>
                </div>

            </MgeLayout>
        );
    }
}

ReactDOM.render(<AnalyticsEntry />, document.getElementById('wrap'));

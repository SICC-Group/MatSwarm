import React, { Component } from 'react';

import navArrow from '../../img/nav-arrow.png';

import './Breadcrumb.less';
import { FormattedMessage } from 'react-intl';
import Urls from '../../apis/Urls';
export interface BreadcrumbItem {
  title: string | JSX.Element;
  url?: string;
}

export interface BreadcrumbProps {
  className?: string;
  style?: React.CSSProperties;
  items: BreadcrumbItem[];
}

export class Breadcrumb extends Component<BreadcrumbProps> {

  constructor(props: any) {
    super(props);
  }

  render() {
    const className = 'Breadcrumb ' + (this.props.className || '');

    const child: JSX.Element[] = [];
    this.props.items.forEach((value, i, array) => {
      child.push((
        <div key={i} className='Breadcrumb__item'>
          <a href={value.url || 'javascript:void(0)'} style={{ cursor: (value.url ? 'pointer' : 'default') }}>
            {value.title}
          </a>
        </div>
      ));
      if (i < array.length - 1) {
        child.push((
          <img key={`${i}'-arrow'`} className='Breadcrumb__arrow' src={navArrow} />
        ));
      }
    });

    return (
      <div className={className} style={this.props.style}>
        {child}
      </div>
    );
  }
}


export namespace Breadcrumb {
  // export const MGED: BreadcrumbItem = {
  //   title: <FormattedMessage id='MGED' defaultMessage='材料基因工程专用数据库' />,
  //   url: Urls.site_index,
  // }

  // export const MDB: BreadcrumbItem = {
  //   title: <FormattedMessage id='mdb' defaultMessage='材料数据库' />,
  //   url: Urls.search.index,
  // }

  export const MGED: BreadcrumbItem = {
    title: <FormattedMessage id='MatSwarm' defaultMessage='MatSwarm演示系统' />,
    url: Urls.site_index,
  }

  export const MDB: BreadcrumbItem = {
    title: <FormattedMessage id='mdb' defaultMessage='数据管理' />,
    url: Urls.search.index,
  }

  export const Search: BreadcrumbItem = {
    title: <FormattedMessage id='search' defaultMessage='搜索' />,
    url: Urls.search.index,
  }

  export const DataExport: BreadcrumbItem = {
    title: <FormattedMessage id='export:data' defaultMessage='数据导出' />,
    url: Urls.storage.export_data,
  }
  export const FeedbackDetail: BreadcrumbItem = {
    title: <FormattedMessage id='feedback:detail' defaultMessage='反馈详情' />,
  }
  export const SubmitFeedback: BreadcrumbItem = {
    title: <FormattedMessage id='feedback:submit' defaultMessage='提交反馈' />,
  }

  export const TaskManagement: BreadcrumbItem = {
    title: <FormattedMessage id='TaskMgmt' defaultMessage='任务管理' />,
    url: Urls.federated.TaskManagement,
  }
  export const Distribution: BreadcrumbItem = {
    title: <FormattedMessage id='TaskSub' defaultMessage='任务下发' />,
    url: Urls.federated.TaskManagement,
  }
}
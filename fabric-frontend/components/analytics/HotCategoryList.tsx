import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { autobind } from 'core-decorators';

import { CategoryData } from '../../apis/analytics/Get';
import { TitledDataList } from './TitledDataList';

export interface HotCategoryListProps {
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
    data?: CategoryData[];
    maxLength?: number;
    onItemClick?: (key: string) => void;
}

const headers = [
    {
        key: 'name',
        content: <FormattedMessage id='name' defaultMessage='名称'/>,
    },
    {
        key: 'data',
        content: <FormattedMessage id='analytics:data_count' defaultMessage='数据总量'/>,
    },
    {
        key: 'view',
        content: <FormattedMessage id='analytics:views' defaultMessage='查看量'/>,
    },
    {
        key: 'download',
        content: <FormattedMessage id='analytics:downloads' defaultMessage='下载量'/>,
    },
    {
        key: 'template',
        content: <FormattedMessage id='analytics:template_count' defaultMessage='模板数'/>,
    },
];

export class HotCategoryList extends Component<HotCategoryListProps> {

    @autobind
    processor(item: CategoryData) {
        return {
            key: item.id.toString(),
            content: [
                item.name,
                item.counts.data,
                item.counts.view,
                item.counts.download,
                item.counts.template,
            ],
        };
    }

    render() {
        const data = [...this.props.data];
        data.sort((a, b) => b.counts.data - a.counts.data);

        return (
            <TitledDataList className={this.props.className}
                style={this.props.style}
                loading={this.props.loading}
                data={data}
                headers={headers}
                onClick={this.props.onItemClick}
                maxLength={this.props.maxLength}
                processor={this.processor}
                />
        );
    }
}

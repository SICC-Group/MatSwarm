import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { autobind } from 'core-decorators';

import { Search } from '../../apis/define/search';
import { DataMeta, RawSearch, SearchConfig, SearchOrderType, SearchSortType } from '../../apis/Search';
import {CreateQuery, QueryResultItem} from '../../apis/search/v2/Query';
import { TitledDataList } from './TitledDataList';

export interface HotDataListProps {
    className?: string;
    style?: React.CSSProperties;
    maxLength?: number;
    category_id: string | number;
    onItemClick?: (key: string) => void;
}

interface State {
    loading: boolean;
    // data?: DataMeta[];
    data?: QueryResultItem[];
}

const headers = [
    {
        key: 'name',
        content: <FormattedMessage id='name' defaultMessage='名称' />,
    },
    {
        key: 'author',
        content: <FormattedMessage id='author' defaultMessage='作者' />,
    },
    {
        key: 'source',
        content: <FormattedMessage id='source' defaultMessage='来源' />,
    },
    {
        key: 'add_time',
        content: <FormattedMessage id='add_time' defaultMessage='提交时间' />,
    },
    {
        key: 'view',
        content: <FormattedMessage id='analytics:views' defaultMessage='查看量' />,
    },
    {
        key: 'download',
        content: <FormattedMessage id='analytics:downloads' defaultMessage='下载量' />,
    },
];

export class HotDataList extends Component<HotDataListProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            data: null,
        };
        this.fetchData();
    }

    componentWillReceiveProps(nextProps: HotDataListProps) {
        this.setState({
            loading: true,
        });
        this.fetchData();
    }

    @autobind
    fetchData() {
        const config: SearchConfig = {
            sort: SearchSortType.DataViews,
            order: SearchOrderType.Descending,
            page: 1,
            q: {
                meta: {
                    field: 'category',
                    op: Search.Operator.Equal,
                    val: String(this.props.category_id),
                },
            },

            // callback: (data) => {
            //     this.setState({
            //         loading: false,
            //         data: data.result,
            //     });
            // },
        };

        // RawSearch(config).then((data) => {
        //     this.setState({
        //         loading: false,
        //         data: data.result,
        //     })
        // })
        CreateQuery({text: null, data: null, meta: null, sort: {views: 'desc'}}).then((res) => {
            this.setState({
                loading: false,
                data: res.q.data,
            });
        });
    }

    @autobind
    processor(item: QueryResultItem) {
        return {
            key: item.data.id.toString(),
            content: [
                item.data.title,
                item.data.user,
                item.data.source,
                item.data.add_time,
                item.data.views,
                item.data.downloads,
            ],
        };
    }

    render() {
        return (
            <TitledDataList className={this.props.className}
                style={this.props.style}
                loading={this.state.loading}
                data={this.state.data}
                headers={headers}
                onClick={this.props.onItemClick}
                maxLength={this.props.maxLength}
                processor={this.processor}
            />
        );
    }
}

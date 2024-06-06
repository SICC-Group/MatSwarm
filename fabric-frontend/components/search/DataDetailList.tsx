import React, { Component } from 'react';
import { FieldType } from '../../apis/define/FieldType';
import { DataDetailItem } from '../../apis/search/v2/Query';
import { Table, Checkbox, Pagination } from 'antd';
import { autobind } from 'core-decorators';
import { FormattedMessage } from 'react-intl';

import './DataDetailList.less';
import { data } from 'jquery';

export interface DetailColumn {
    // 路径
    // 对于元数据例如title，为['title']
    // 元数据字段渲染到表头的时候，需要做翻译
    // 对于数据内容，比如容器A下面的字符串字段B，为['A', 'B']
    fullPath: string[];
    // 字段类型
    // 对于元数据字段，不必参考这一项的值
    type: FieldType.Primitive;
    // 表示这一列是否是元数据字段
    // 元数据字段直接在data里可以读取到
    // 非元数据字段需要在content里根据fullPath递归读取
    isMeta?: boolean;
}

export interface Props {
    // 数据
    data: DataDetailItem[];
    columns: DetailColumn[];
    count: number;
    page_size: number;
    page: number;
    init?: boolean;
    onAddData: (dataID: number | number[]) => void;
    onRemoveData: (dataID: number | number[]) => void;
    onPageChange: (newPage: number) => void;
}

export class DataDetailList extends Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    // 获取索引(表头)
    @autobind
    getDataIndex(fullPath: string[]) {
        let data_index = '';
        data_index = fullPath[0];
        if (fullPath.length > 1) {
            for (let i = 1; i < fullPath.length; i++) {
                data_index = data_index + '/' + fullPath[i];
            }
        }
        return data_index;
    }
    // 获取表格中具体的值
    @autobind
    getInfRight(inf_left: string, IsMeta: boolean, i: number) {
        try {
            let inf_right = '';
            if (IsMeta) {
                inf_right = this.props.data[i].data[inf_left] as string;
            } else {
                const inf_left_index = inf_left.split('/');
                if (inf_left_index.length > 1) {
                    let xxx = this.props.data[i].data.content;
                    for (let j = 0; j < inf_left_index.length; j++) {
                        if ((j + 1) === inf_left_index.length) {
                            inf_right = xxx[inf_left_index[j]];
                            break;
                        }
                        xxx = xxx[inf_left_index[j]];
                    }
                } else {
                    inf_right = this.props.data[i].data.content[inf_left];

                }
            }
            return inf_right;
        }
        catch {
            return '';
        }
    }
    // 单个数据下载de 添加移除
    @autobind
    dataDownload(data_id: number) {
        this.props.onAddData(data_id);
    }
    // 数据下载,全选
    @autobind
   dataDownload_all() {
        let id_all: any [] = []
        this.props.data.map( i => {
            id_all.push(i.data.id)
        })
        this.props.onAddData(id_all)
    }

    @autobind
    removeAll() {
         let id_all: any [] = []
        this.props.data.map( i => {
            id_all.push(i.data.id)
        })
        this.props.onRemoveData(id_all);
    }
 
    render() {
        let dataDetial_columns = [];
        let dataDetial_data = [];
        let dataDetial_columns_name = [];

        dataDetial_columns.push({
            title: <Checkbox style={{ whiteSpace: 'nowrap' }} checked={ this.props.data.every(i => i.download)} onChange={(e) => e.target.checked ?this.dataDownload_all() :this.removeAll() }><FormattedMessage id='Add all to download list' defaultMessage='全部加入下载'/></Checkbox>,
            dataIndex: 'data_download',
        })
        // 表头的获取
        // for (let i = 0; i < this.props.columns.length; i++) {
        //     const data_index = this.getDataIndex(this.props.columns[i].fullPath);
        //     dataDetial_columns.push({
        //         title: this.props.columns[i].fullPath[0],
        //         dataIndex: data_index,
        //     });
        //     dataDetial_columns_name.push(data_index);
        // }
        for (let col of this.props.columns) {
            const index = this.getDataIndex(col.fullPath);
            const title = col.isMeta ? <FormattedMessage id={col.fullPath[0]} /> : col.fullPath[0];
            const isTitleField = col.isMeta && col.fullPath[0] === 'title';
            if (isTitleField) {
                dataDetial_columns.push({
                    title, dataIndex: index,
                    render: (text: string, record: any, index: number) => {
                        return (
                            // <a href={this.props.data[index].data == null ? '' : `/storage/data/${this.props.data[index].data.id}`}>{text}</a>
                            <a href={this.props.data[index].data == null ? '' : `/show_data?dataID=${this.props.data[index].data.id}`}>{text}</a>
                        )
                    }
                });
            }
            else {
                dataDetial_columns.push({
                    title, dataIndex: index
                });
            }

            dataDetial_columns_name.push(index);
        }

        // 表数据的获取
        for (let i = 0; i < this.props.data.length; i++) {
            const current = this.props.data[i];
            let i_str = i.toString();
            let body_detial = { key: i_str };
            for (let j = 0; j < dataDetial_columns_name.length; j++) {
                let inf_left = dataDetial_columns_name[j];
                const inf_right = this.getInfRight(inf_left, this.props.columns[j].isMeta, i);
                let body_detial_x = { [inf_left]: [inf_right] };
                body_detial = Object.assign(body_detial_x, body_detial);
            }
            let body_detial_x = {
                data_download: (
                    <Checkbox checked={current.download}
                        onChange={(e) => e.target.checked ? this.props.onAddData(Number(current.data.id)) : this.props.onRemoveData(Number(current.data.id))}>
                    </Checkbox>
                )
            };
            body_detial = Object.assign(body_detial_x, body_detial);

            dataDetial_data.push(body_detial);
        }

        return (
            <div>
                <div style={{ overflowX: 'scroll' }}>
                    <Table columns={dataDetial_columns} style={{ whiteSpace: 'nowrap' }}
                        dataSource={dataDetial_data} pagination={false} />
                </div>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                    <Pagination
                        onChange={(page) => this.props.onPageChange(page)}
                        current={this.props.page == null ? 1 : this.props.page} size={'big'}
                        pageSize={this.props.page_size == null ? 20 : this.props.page_size} total={this.props.count} />
                </div>
            </div>

        );
    }
}

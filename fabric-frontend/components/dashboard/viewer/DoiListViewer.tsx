import React, { FC, useEffect, useState } from 'react';
import { Button, Card, Pagination, Row, Col } from 'antd';
import { ExportData } from '../../../apis/export/ExportData';
import { Dataset } from '../../../apis/define/Dataset';
import { DatasetList, DeleteDataset, ViewDataset } from '../../../apis/data/DatasetList';
import { DatasetModal } from '../modal/DatasetModal'
import { TEXT } from '../../../locale/Text';

export interface DoiListViewerProps {
    // 是否显示管理员的内容
    admin: boolean;
    // 当前页的数据列表
    data: Dataset[];
    // 数据总量
    total: number;
    // 每个页面的大小
    pageSize: number;
    // 当前页码
    page: number;

    loading?: boolean;
    onPageChange: (newPage: number) => void;
}

export const DoiListViewer: FC<DoiListViewerProps> = (props) => {

    const [innerData, setInnerData] = useState<Dataset[]>([]);
    const [dataVisible, setDataVisible] = useState<boolean>(false);
    const [dataIds, setDataIds] = useState<number[]>([]);

    useEffect(() => {
        setInnerData(props.data);
    }, [props.data]);

    const informUpdate = () => {
        DatasetList(1).then(value => {
            setInnerData(value.results);
        })
    }

    const deleteDataset = (e: any) => {
        DeleteDataset(e.target.value);
        informUpdate();
    }

    const viewData = (e: any) => {
        setDataVisible(true);
        ViewDataset(e.target.value).then(value => {
            setDataIds(value.data_ids);
        })
    }

    const exportDataset = (e: any) => {
        ViewDataset(e.target.value).then(value => {
            setDataIds(value.data_ids);
            var ids: string[] = [];
            value.data_ids.forEach(element => {
                ids.push(String(element))
            });
            ExportData('XLSX', ids, false).then((value) => {
                window.open(value.result);
            });
        })
    }

    return (
        <div>
            {innerData.map((v) => {
                return (
                    <div key={v.id}>
                        <Card hoverable={false} title={v.title} key={v.id}
                            headStyle={{ background: '#5AA6C8', color: '#fff' }}
                            bodyStyle={{ padding: '10px' }}
                            style={{ width: '100%', marginTop: '10px' }}>
                            <div style={{ display: 'inline', float: 'right', width: '95%' }}>
                                <Row style={{ height: '30px' }}>
                                    <Col span={18}>
                                        <span>{TEXT('dash:dataset_name', '数据集名称：')}</span>
                                        <span>{v.title}</span>
                                    </Col>
                                    <Col span={6}>
                                        <Button size='small' value={v.id} onClick={exportDataset}>{TEXT('dash:download_dataset', '数据集下载')}</Button>
                                        <Button size='small' type='danger' value={v.id} onClick={deleteDataset}>{TEXT('dash:delete', '删除')}</Button>
                                    </Col>
                                </Row>
                                <Row style={{ height: '30px' }}>
                                    <Col span={18}>
                                        <span>{TEXT('dash:doi', 'DOI：')}</span>
                                        <span>{v.doi}</span>
                                    </Col>
                                    <Col span={6}>
                                        <Button size='small' type='primary' value={v.id} onClick={viewData}>{TEXT('dash:view_data_list', '查看数据')}</Button>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </div>);
            })}
            <DatasetModal visible={dataVisible} record={dataIds} onClose={() => setDataVisible(false)} />
            <Pagination
                onChange={(page) => props.onPageChange(page)}
                current={Number(props.page)} size={'big'} pageSize={props.pageSize} total={props.total} />
        </div>
    )
}

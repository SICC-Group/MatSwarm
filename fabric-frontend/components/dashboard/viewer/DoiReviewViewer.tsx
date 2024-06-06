import React, { FC, useEffect, useState } from 'react';
import { Table,Button,notification } from 'antd';
import { PaginationConfig } from 'antd/lib/table';

import { ReviewState } from '../../../apis/define/ReviewState';
import { DoiReviewItem,DoiReview,DoiReviewList } from '../../../apis/data/DoiReviewList';
import { TEXT } from '../../../locale/Text';

export interface DoiReviewViewerProps {
    // 是否显示管理员的内容
    admin?: boolean;
    // 当前页的数据列表
    data: DoiReviewItem[];
    // 数据总量
    total: number;
    // 每个页面的大小
    pageSize: number;
    // 当前页码
    current: number;
    currentstate:ReviewState;
    loading?: boolean;
    onPageChange: (newPage: number) => void;

    allowDelete?: boolean;
    allowEdit?: boolean;
}

const Column = Table.Column;

export const DoiReviewViewer: FC<DoiReviewViewerProps> = (props) => {

    const handleTableChange = (pagination: PaginationConfig) => {
        props.onPageChange(pagination.current);
    }
    const [innerData, setInnerData] = useState<DoiReviewItem[]>([]);
    const [yesLoading, setYesLoading] = useState(false);
    const [yesData,setyesData] = useState<number[]>([]); //存储审核通过的数据的编号
    const [noData,setnoData] = useState<number[]>([]); //存储审核不通过的数据的编号
    useEffect(() => {
        setInnerData(props.data);
    }, [props.data]);

    const handleYesClick = (id:number) => {
        setYesLoading(true);
        yesData.push(id);
        DoiReview(yesData,noData).then(()=>{
            DoiReviewList(props.currentstate, 1).then(value => {
                setInnerData(value.results);
                setYesLoading(false);
                setyesData([]);
            })
            notification['success']({
                message: '操作成功',
            })
        }).catch((reason: Error) => {
            notification['error']({
              message: reason.message,
            })
            setYesLoading(false);
            setyesData([]);
          })
    }
    const handleNoClick = (id:number) =>{
        setYesLoading(true);
        noData.push(id);
        DoiReview(yesData,noData).then(()=>{
            DoiReviewList(props.currentstate, 1).then(value => {
                setInnerData(value.results);
                setYesLoading(false);
                setnoData([]);
            })
            notification['success']({
                message: '操作成功',
            })
        }).catch((reason: Error) => {
            notification['error']({
              message: reason.message,
            })
            setYesLoading(false);
            setnoData([]);
          })
    }
    return (
        <>
            <Table onChange={handleTableChange} rowKey={'templates_id'}
                dataSource={innerData} loading={props.loading} pagination={{ total: props.total, pageSize: props.pageSize, current: props.current }}>
                <Column title={TEXT('dash:ID', '编号')} dataIndex='id' key='id' />
                <Column title={TEXT('dash:title', 'DOI数据集名称')} dataIndex='title' key='title' />
                <Column title={TEXT('dash:application_time', '申请时间')} dataIndex='add_time' key='add_time' render={text => new Date(text).toLocaleDateString()} />
                <Column title={TEXT('dash:applicant', '申请人')} dataIndex='applicant' key='applicant' />
                <Column title={TEXT('dash:data','数据内容')} render={(text: ReviewState, record: DoiReviewItem)=>{
                    return(
                        <a href={'/storage/data/doilist/detail/'+record.id+'?page=1' } target='_blank'>数据详情</a>
                    )
                }}/>
                <Column title={TEXT('dash:status', '状态')} dataIndex='status' key='status' render={(text: ReviewState, record: []) => {
                    let content: React.ReactNode = null;

                    switch (text) {
                        case ReviewState.Approved: content = TEXT('dash:approved', '通过'); break;
                        case ReviewState.Disapproved: content = <span style={{ color: 'red' }}>{TEXT('dash:disapproved', '未通过')}</span>; break;
                        case ReviewState.Pending: content = TEXT('dash:pending', '等待审核'); break;
                    }
                    return (
                        <div>
                            {content} <br />
                        </div>
                    )
                }} />
                <Column
                    title={TEXT('dash:action', '操作')}
                    key="action"
                    render={(text, record: DoiReviewItem, index) => (
                        <div>
                        {props.admin && (record.status == ReviewState.Pending) ? 
                        <Button size='small' type='primary' loading={yesLoading} onClick={()=>handleYesClick(record.id)}>{TEXT('dash:approve', '通过')}</Button>
                        : null}
                        {props.admin && (record.status == ReviewState.Pending) ? 
                        <Button size='small' type='danger' loading={yesLoading} onClick={()=>handleNoClick(record.id)}>{TEXT('dash:disapprove', '拒绝')}</Button>
                        : null}
                        </div>
                    )
                    }
                />
            </Table>
        </>
    )
}

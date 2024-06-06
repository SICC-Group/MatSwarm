import React, { FC, useEffect, useState } from 'react';

import { Table } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import { Link } from 'react-router-dom';
import { ReviewState } from '../../../apis/define/ReviewState';
import { TemplatesReviewAction } from './TemplatesReviewAction';
import { TemplatesReview } from '../../../apis/define/TemplateReview';
import { RefuseTemplateModal } from '../modal/RefuseTemplateModal';
import { TEXT } from '../../../locale/Text';

export interface TemplatesReviewViewerProps {
    // 是否显示管理员的内容
    admin?: boolean;
    // 当前页的数据列表
    data: TemplatesReview[];
    // 数据总量
    total: number;
    // 每个页面的大小
    pageSize: number;
    // 当前页码
    current: number;

    loading?: boolean;
    onPageChange: (newPage: number) => void;

    allowDelete?: boolean;
    allowEdit?: boolean;
}

const Column = Table.Column;

export const TemplatesReviewViewer: FC<TemplatesReviewViewerProps> = (props) => {

    const handleTableChange = (pagination: PaginationConfig) => {
        props.onPageChange(pagination.current);
    }
    const [innerData, setInnerData] = useState<TemplatesReview[]>([]);
    useEffect(() => {
        setInnerData(props.data);
    }, [props.data]);


    const [showRefuseModal, setShowRefuseModal] = useState(false);
    const [currentViewRecord, setCurrentViewRecord] = useState<TemplatesReview>(null);


    const informUpdate = () => {
        setInnerData([...innerData]);
    }

    const handleViewRecord = (record: TemplatesReview) => {
        window.location.href = '/storage/template/' + record.id + '/check'
    }

    const handleRefuseRecord = (record: TemplatesReview) => {
        setCurrentViewRecord(record);
        setShowRefuseModal(true);
    }

    const handleInformDeleted = (index: number) => {
        setInnerData([...innerData.slice(0, index), ...innerData.slice(index + 1)]);
    }
   
    return (
        <>
            <Table onChange={handleTableChange} rowKey={'templates_id'}
                dataSource={innerData} loading={props.loading} pagination={{ total: props.total, pageSize: props.pageSize, current: props.current }}>
                <Column title={TEXT('dash:ID', '编号')} dataIndex='id' key='id' />
                <Column title={TEXT('dash:title', '标题')} dataIndex='title' key='title' render={(text,record:TemplatesReview)=>{
                    return <a href={`/storage/check_template/${record.id}`} >{text}</a>
                } } />  
                <Column title={TEXT('dash:pub_date', '发布时间')} dataIndex='pub_date' key='time' render={text => new Date(text).toLocaleDateString()} />
                <Column title={TEXT('dash:data_count', '数据量')} dataIndex='data_count' key='count' />
                <Column title={TEXT('dash:uploader', '上传人')} dataIndex='real_name' key='uploader' />
                <Column title={TEXT('dash:reviewer', '审核人')} dataIndex='reviewer_real_name' key='reviewer' />
                <Column title={TEXT('dash:status', '状态')} dataIndex='review_state' key='review_state' render={(text: ReviewState, record: TemplatesReview) => {
                    let content: React.ReactNode = null;

                    switch (text) {
                        case ReviewState.Approved: content = TEXT('dash:approved', '通过'); break;
                        case ReviewState.Disapproved: content = <span style={{ color: 'red' }}>{TEXT('dash:disapproved', '未通过')}</span>; break;
                        case ReviewState.Pending: content = TEXT('dash:pending', '等待审核'); break;
                    }
                    return (
                        <div>
                            {content} <br />
                            {text === ReviewState.Disapproved ? record.disapprove_reason : null}
                        </div>
                    )
                }} />
                <Column
                    title={TEXT('dash:action', '操作')}
                    key="action"
                    render={(text, record: TemplatesReview, index) => {
                        return (
                            <TemplatesReviewAction admin={props.admin} onRefuse={handleRefuseRecord}
                                informUpdate={informUpdate}
                                informDeleted={() => handleInformDeleted(index)}
                                allowDelete={props.allowDelete}
                                allowEdit={props.allowEdit}
                                record={record} onView={handleViewRecord} />
                        )
                    }
                    }
                />
            </Table>
            <RefuseTemplateModal visible={showRefuseModal} onClose={() => setShowRefuseModal(false)} record={currentViewRecord} />
        </>
    )
}

import React, { FC, useEffect, useState } from 'react';

import { Table, Button, Upload, notification } from 'antd';
import { PaginationConfig } from 'antd/lib/table';

import { AcceptanceState } from '../../../apis/define/AcceptanceState';
import { AssignCertList, CertApply } from '../../../apis/certificate/AssignCertList';
import { AssignModal } from '../modal/AssignModal';
import { AssignViewModal } from '../modal/AssignViewModal';
import { AssignModifyModal } from '../modal/AssignModifyModal';
import { TEXT } from '../../../locale/Text';
import { EvaluationModal } from '../modal/EvaluationModal';
import { GetEvaluationResult } from '../../../apis/evaluation/GetEvaluationResult';
import Urls from '../../../apis/Urls';

export interface AssignCertViewerProps {
    // 当前页的数据列表
    data: CertApply[];
    // 数据总量
    total: number;
    // 每个页面的大小
    pageSize: number;
    // 当前页码
    current: number;

    state: AcceptanceState;

    loading?: boolean;
    onPageChange: (newPage: number) => void;
}

const Column = Table.Column;

export const AssignCertViewer: FC<AssignCertViewerProps> = (props) => {
    const [loading, setLoading] = useState<boolean>(props.loading);
    const [innerData, setInnerData] = useState<CertApply[]>([]);
    const [currentViewRecord, setCurrentViewRecord] = useState<CertApply>(props.data[0]);
    const [showViewModal, setShowViewModal] = useState<boolean>(false);
    const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
    const [showModifyModal, setShowModifyModal] = useState<boolean>(false);
    const [showEvaluateModal, setShowEvaluateModal] = useState<boolean>(false);
    const [evaluationres, setEvaluationres] = useState([]) //评价结果
    const [data, setData] = useState<any>({}) //用于评价的记录
    useEffect(() => {
        setInnerData(props.data);
    }, [props.data]);

    useEffect(() => {
        setLoading(props.loading)
    }, [props.loading]);

    const handleTableChange = (pagination: PaginationConfig) => {
        props.onPageChange(pagination.current);
    }

    const handleViewRecord = (record: CertApply) => {
        setCurrentViewRecord(record);
        setShowViewModal(true);
    }

    const handleAssignRecord = (record: CertApply) => {
        setCurrentViewRecord(record);
        setShowAssignModal(true);
    }

    const handleModifyRecord = (record: CertApply) => {
        setCurrentViewRecord(record);
        setShowModifyModal(true);
    }

    const handleUpdate = () => {
        setLoading(true);
        AssignCertList(1, props.state).then(value => {
            setInnerData(value.data);
            setLoading(false);
        });
    }

    const handleEvaluate = (record: CertApply) => {
        setData({ acceptance_id: record.id, cert_key: record.cert_key, finished: false });
        setShowEvaluateModal(true);
        GetEvaluationResult(record.id.toString()).then((value) => {
            setEvaluationres(value);
        });
    }

    const handleViewEvaluate = (record: CertApply) => {
        setData({ acceptance_id: record.id, cert_key: record.cert_key, finished: true });
        setShowEvaluateModal(true);
        GetEvaluationResult(record.id.toString()).then((value) => {
            setEvaluationres(value);
        });
    }

    const handleUpload = (file: any) => {
        if (file.status === 'done') {
            notification['success']({
                message: TEXT('op_success', '操作成功')
            })
            handleUpdate();
        }
        if (file.status === 'error') {
            notification['error']({
                message: file.response.extra.err_detail
            })
        }
    }

    const handleDownload = (record: CertApply) => {
        window.open(Urls.api_cert.signature(record.id))
    }

    return (
        <>
            <Table onChange={handleTableChange} rowKey={record => record.id.toString()}
                dataSource={innerData} loading={loading} pagination={{
                    total: props.total, pageSize: props.pageSize, current: props.current
                }}>
                <Column title={TEXT('dash:project/subject', '项目编号/课题编号')} dataIndex='ps_id' key='ps_id' />
                <Column title={TEXT('name', '项目/课题')} dataIndex='name' key='name' width='25%' />
                <Column title={TEXT('dash:time', '申请时间')} dataIndex='create_time' key='time' />
                <Column title={TEXT('dash:applicant', '申请人')} dataIndex='leader' key='applicant' />
                <Column title={TEXT('dash:status', '状态')} dataIndex='state' key='state' render={(value: AcceptanceState) => {
                    let content: React.ReactNode = null;
                    switch (value) {
                        case AcceptanceState.Dispatching: content = TEXT('dash:dispatching', '待分配验收专家'); break;
                        case AcceptanceState.Expert_Evaluating: content = TEXT('dash:expert_evaluating', '专家评价中'); break;
                        case AcceptanceState.Leader_Evaluating: content = TEXT('dash:leader_evaluating', '评价组长评价中'); break;
                        case AcceptanceState.Signature_Pending: content = TEXT('dash:signature_pending', '等待上传报告'); break;
                        case AcceptanceState.Failed: content = TEXT('dash:failed', '不通过'); break;
                        case AcceptanceState.Finished: content = TEXT('dash:finished', '验收完成'); break;
                    }
                    return (
                        <div>
                            {content} <br />
                        </div>
                    )
                }} />
                <Column title={TEXT('dash:action', '操作')} dataIndex='state' key='action' render={(value: AcceptanceState, record: CertApply) => {
                    let content: React.ReactNode = null;

                    switch (value) {
                        case AcceptanceState.Dispatching:
                            content = <Button type='primary' onClick={() => handleAssignRecord(record)}>{TEXT('dash:assign', '分配验收专家')}</Button>;
                            break;
                        case AcceptanceState.Expert_Evaluating:
                            content = <span>
                                <Button onClick={() => handleViewRecord(record)} style={{ marginRight: '5px' }}>{TEXT('dash:view', '查看分配')}</Button>
                                <Button type='danger' onClick={() => handleModifyRecord(record)}>{TEXT('dash:modify', '修改验收专家')}</Button>
                            </span>
                            break;
                        case AcceptanceState.Leader_Evaluating:
                            content = <Button type='primary' onClick={() => handleEvaluate(record)}>{TEXT('dash:evaluate', '评价')}</Button>
                            break;
                        case AcceptanceState.Signature_Pending:
                            content = <span>
                                <Button onClick={() => handleViewEvaluate(record)} style={{ marginRight: '5px' }}>{TEXT('dash:evaluation_reuslt', '查看评价结果')}</Button>
                                <Upload showUploadList={false} accept='.pdf' name='signature' onChange={(file) => handleUpload(file.file)} action={Urls.api_cert.signature(record.id)}>
                                    <Button type='primary'>{TEXT('dash:upload_scan', '上传扫描件')}</Button>
                                </Upload>
                            </span>
                            break;
                        case AcceptanceState.Failed:
                            content = <Button onClick={() => handleViewEvaluate(record)}>{TEXT('dash:evaluation_reuslt', '查看评价结果')}</Button>
                            break;
                        case AcceptanceState.Finished:
                            content = <span>
                                <Button onClick={() => handleViewEvaluate(record)} style={{ marginRight: '5px' }}>{TEXT('dash:evaluation_reuslt', '查看评价结果')}</Button>
                                {/* <Button onClick={() => handleDownload(record)}>{TEXT('dash:download_scan', '下载验收报告')}</Button> */}
                            </span>
                            break;
                    }
                    return (
                        <div>
                            {content} <br />
                        </div>
                    )
                }} />
            </Table>
            <AssignViewModal visible={showViewModal} record={currentViewRecord} onClose={() => setShowViewModal(false)} />
            <AssignModal visible={showAssignModal} record={currentViewRecord} onClose={() => setShowAssignModal(false)} onUpdate={handleUpdate} />
            <AssignModifyModal visible={showModifyModal} record={currentViewRecord} onClose={() => setShowModifyModal(false)} onUpdate={handleUpdate} />
            <EvaluationModal visible={showEvaluateModal} record={data} evaluationscore={null} evaluationres={evaluationres} onClose={() => {setShowEvaluateModal(false),setEvaluationres([])}} />
        </>
    )
}

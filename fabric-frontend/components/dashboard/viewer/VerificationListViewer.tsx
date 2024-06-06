import React, { FC, useEffect, useState } from 'react';
import { TEXT } from '../../../locale/Text';
import '../modal/EvaluationModal.less';
import {Table, Button, Popconfirm, Pagination, Icon} from 'antd';
import {PaginationConfig} from 'antd/lib/table';
import { AcceptanceState } from '../../../apis/define/AcceptanceState';
import {RoleCheckWrapper} from '../../layout/RoleCheckWrapper';
import {AcceptanceRole} from '../../../apis/define/User';
import {ColumnFilterItem} from 'antd/es/table';
import {EvaluationModal} from '../modal/EvaluationModal';
import {GetEvaluationResult} from "../../../apis/evaluation/GetEvaluationResult";
import Urls from "../../../apis/Urls";

export interface VerificationListViewerProps {
    // 当前页的数据列表
    data: any[];
    // 每个页面的大小
    pageSize: number;
    // 总页码
    page_count: number;
    // 当前页码
    current: number;
    // 总数
    total: number,

    loading?: boolean;
    onPageChange: (current: number) => void;
    handleDelete: (id: string) => void;

    allowDelete?: boolean;
}
const Column = Table.Column;

export const VerificationListViewer: FC<VerificationListViewerProps> = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [ModalData, setModalData] = useState([]);
    const [EvaluationData, setEvaluationData] = useState<any>([])
    const handleEvaluationModal = (record: any) => {
        setModalVisible(true);
        setModalData(record);
        GetEvaluationResult(record.id).then((value)=>{
            setEvaluationData(value);
        })
    }
    const handleDownload = (record: any) => {
         window.open(Urls.api_cert.signature(record.id));
    }
    const filters: ColumnFilterItem[] = [
        {
            text: TEXT('dash:expert_evaluating', '专家评价中'),
            value: String(AcceptanceState.Expert_Evaluating),
        },
        {
            text: TEXT('dash:leader_evaluating', '评价组长评价中'),
            value: String(AcceptanceState.Leader_Evaluating),
        },
        // {
        //     text: TEXT('dash:signature_pending', '等待上传签名报告'),
        //     value: String(AcceptanceState.Signature_Pending),
        // },
        {
            text: TEXT('dash:failed', '未通过'),
            value: String(AcceptanceState.Failed),
        },
        {
            text: TEXT('dash:finished', '验收结束'),
            value: String(AcceptanceState.Finished),
        },
    ]
    return(
        <div>
        <Table rowKey={(record) => record.cert_key}
               loading={props.loading} dataSource={props.data}
               pagination={{ pageSize: props.pageSize, current: props.current,
                   total: props.total, onChange:(current) => {props.onPageChange(current)} }}
        >
            <Column title={TEXT('dash:ps_id', '项目编号/课题编号')} dataIndex='ps_id' key='ps_id' />
            <Column title={TEXT('dash:ps_name', '项目名称/课题名称')} dataIndex='name' key='name'  width='25%' />
            <Column title={TEXT('dash:application_time', '发布时间')} dataIndex='create_time' key='create_time' render={text => new Date(text).toLocaleDateString()} />
            <Column title={TEXT('dash:applicant', '申请人')} dataIndex='leader' key='leader' />
            <Column title={TEXT('dash:status', '状态')} dataIndex='state' key='state'
                    filters = {filters}
                    filterIcon = {<Icon type="down" />}
                    onFilter = {(value, record: any) => record.state.toString() === value}
                    render={(value: AcceptanceState) => {
                let content: React.ReactNode = null;
                switch (value) {
                    case AcceptanceState.Dispatching: content = TEXT('dash:dispatching', '待分配验收专家'); break;
                    case AcceptanceState.Expert_Evaluating: content = TEXT('dash:expert_evaluating', '专家评价中'); break;
                    case AcceptanceState.Leader_Evaluating: content = TEXT('dash:leader_evaluating', '评价组长评价中'); break;
                    // case AcceptanceState.Signature_Pending: content = TEXT('dash:signature_pending', '等待上传签名报告');
                    case AcceptanceState.Failed: content = TEXT('dash:failed', '未通过'); break;
                    case AcceptanceState.Finished: content = TEXT('dash:finished', '验收结束'); break;
                }
                return (
                    <div>
                        {content} <br />
                    </div>
                );
            }} />
            <Column title={TEXT('dash:action', '操作')} render={(record) => {
                let content: React.ReactNode = null;
                switch (record.state){
                     case AcceptanceState.Dispatching: content = <Popconfirm placement= 'top' onConfirm={(e) => {props.handleDelete(record.id); } }
                                    title= {TEXT('dash:RevokeVerification', '确认要撤销吗')}
                                    okText= {TEXT('submit', '确认')} cancelText={TEXT('cancel', '取消')}>
                            <Button type='danger' style={{marginRight: '10px'}}>{TEXT('dash:revoke', '撤销')}</Button>
                        </Popconfirm>;                 break;
                    case AcceptanceState.Signature_Pending:
                    case AcceptanceState.Failed:
                    case AcceptanceState.Finished: content = <div>
                        <Button style={{marginRight: '5px'}}  type='primary' onClick={() => {handleEvaluationModal(record)}}>{TEXT('dash:evaluation_reuslt', '查看评价结果')}</Button>
                        {/* <Button  type='primary' onClick={()=>{handleDownload(record)}} >{TEXT('dash:download_scan', '下载验收报告')}</Button> */}
                    </div>; break;
                }
                return (
                    <div>{content}</div>
                )
            }}>
            </Column>
        </Table>
                 <EvaluationModal record={ModalData} visible={modalVisible}
              evaluationres={EvaluationData} evaluationscore={null}onClose={() => {setModalVisible(false);setEvaluationData([]) } }/>
        </div>
    )
}

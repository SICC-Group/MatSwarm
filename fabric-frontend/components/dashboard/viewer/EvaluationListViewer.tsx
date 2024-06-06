import React, { FC, useEffect, useState } from 'react';
import { PaginationConfig } from 'antd/lib/table';
import { EvaluationState } from '../../../apis/define/EvaluationState';
import { TEXT } from '../../../locale/Text';
import '../modal/EvaluationModal.less'
import {EvaluationModal} from '../modal/EvaluationModal'
import { notification,Table, Button,Modal, Divider } from 'antd';
import {GetEvaluationResult,GetEvaluationJudge,GetEvaluationScore} from '../../../apis/evaluation/GetEvaluationResult'

// import '../modal/EvaluationModal.less'
// import {EvaluationModal} from '../modal/EvaluationModal'

export interface EvaluationListViewerProps {
    // 是否显示管理员的内容
    admin?: boolean;
    // 当前页的数据列表
    data: any[];
    // 每个页面的大小
    pageSize: number;
    total:number;
    // 当前页码
    current: number;
    loading?: boolean;
    onPageChange: (newPage: number) => void;

    allowDelete?: boolean;
    allowEdit?: boolean;
}

const Column = Table.Column;

export const EvaluationListViewer: FC<EvaluationListViewerProps> = (props) => {
    const [ModalVisible,setModalVisible] =  useState(false);
    const [data,setData] = useState<any>({})
    const [evaluationres,setEvaluationres]=useState<any>([]);
    const [evaluationscore, setEvaluationScore] = useState(0);
    const [showViewEvalutionModal, setshowViewEvalutionModal] = useState(false);
    const handleTableChange = (pagination: PaginationConfig) => {
        props.onPageChange(pagination.current);
    }
    const handleclick = (v: any) => {
        GetEvaluationJudge(v.acceptance_id).then((value)=>{     
             if(value===0)
           {
            setshowViewEvalutionModal(true)  
          }
             else if(value===1) 
           {  
             setshowViewEvalutionModal(false)
            GetEvaluationResult(v.acceptance_id).then((value)=>{
            setEvaluationres(value);   
             setModalVisible(true);                         
          })   
    }
        }) 
        GetEvaluationScore(v.acceptance_id).then((value)=>{ 
            setEvaluationScore(value)
        })     
           setData(v)
        }
    const handleviewclick = (v: any) => {
        console.log(v)
        GetEvaluationResult(v.acceptance_id).then((value)=>{
            console.log(value);
            setEvaluationres(value);
        })
        setModalVisible(true);
        setData(v)

    }
    return (
        <div>
            <Table onChange={handleTableChange} rowKey={'templates_id'}
                dataSource={props.data} loading={props.loading} pagination={{total: props.total,pageSize: props.pageSize, current: props.current }}>
                <Column title={TEXT('dash:ID', '项目编号/课题编号')} dataIndex='ps_id' key='ps_id' />
                <Column title={TEXT('dash:application_time', '发布时间')} dataIndex='c_time' key='c_time' render={text => new Date(text).toLocaleDateString()} />
                <Column title={TEXT('dash:applicant', '申请人')} dataIndex='leader' key='leader' />
                <Column title={TEXT('dash:status', '状态')} dataIndex='finished' key='finished' render={(text: boolean, record: []) => {
                    let content: React.ReactNode = null;

                    switch (text) {
                        case true : content = TEXT('dash:approved', '已评价'); break;
                        //case ReviewState.Disapproved: content = <span style={{ color: 'red' }}>{TEXT('dash:disapproved', '未通过')}</span>; break;
                        case false: content = TEXT('dash:pending', '等待评价'); break;
                    }
                    return (
                        <div>
                            {content} <br />
                        </div>
                    )
                }} />
                <Column
                    title={TEXT('dash:action', '审核操作')}
                    key="action"
                    render={(text, record: any) => {
                        return (
                            <div>
                                {(record.finished == false ?
                                    <div>
                                        <Button type='primary' style={{ margin: '0px 5px 5px 0px' }} onClick={() => handleclick(record)}>评价</Button>
                                        <Button disabled style={{ margin: '0px 5px 5px 0px' }}>下载报告</Button><br/>
                                        <Button style={{ margin: '0px 5px 5px 0px' }}><a href='/dashboard/#/cert/data'>查看验收数据</a></Button>
                                    </div>
                                    :
                                    <div>
                                        <Button style={{ margin: '0px 5px 5px 0px' }} onClick={() => handleviewclick(record)}>查看下载报告</Button>
                                        {/* <Button type='primary' style={{ margin: '0px 5px 5px 0px' }}>下载报告</Button><br/> */}
                                    </div>
                                )}
                            </div>
                        )
                    }}
                />
            </Table>
            <EvaluationModal visible={ModalVisible} record={data} evaluationres={evaluationres} evaluationscore={evaluationscore} onClose={() => {setModalVisible(false),setEvaluationres([])}} />
            <Modal
        title={TEXT('warning', '警告')}
        visible={showViewEvalutionModal}
        footer={[
            <div>  
            <Button key="submit" type="primary"onClick={() => setshowViewEvalutionModal(false)}>
              确认
            </Button></div>
          ]}
        >
     
        {TEXT('template:delete_warning', '该项目还有未打分的模板，不能评价！')}
      </Modal>
        </div>
        
    )
}

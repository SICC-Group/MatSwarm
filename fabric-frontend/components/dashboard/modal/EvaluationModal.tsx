import { Button, Input, Modal, notification, Radio, Row, Select, Spin, Tooltip } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { AcceptanceRole } from '../../../apis/define/User';
import { CommitEvaluation } from '../../../apis/evaluation/commit';
import { GetEvaluationPoint } from '../../../apis/evaluation/evaluationpoint';
import { Info } from '../../../apis/session/Info';
import { CertificateViewer } from '../../../entry/CertificateViewer';
import { EvaluationItemViewer } from '../item_viewer/EvaluationItemViewer';
import '../modal/EvaluationModal.less';
import Urls from "../../../apis/Urls";
import {GetEvaluationScore} from '../../../apis/evaluation/GetEvaluationResult'
import html2canvas from 'html2canvas';
import { default as JSPDF } from 'jspdf';

const logo = require('../../../img/certificate_logo.png');
export interface Props {
    evaluationscore:any;
    record: any;
    evaluationres?: any[];
    visible: boolean;
    onClose: () => void;
}
export const EvaluationModal: FC<Props> = (props) => {
    const [evaluationpoint, setevaluationpoint] = useState([]);
    const [isGroupLeader, setIsGroupLeader] = useState(false); // 判断当前用户是否是组长
    const [isManager, setIsManager] = useState(false); // 判断是否未项目负责人或课题负责人
    const [comment, setComment] = useState<string>(''); // 评价情况
    const [evaluations, setEvaluations] = useState<any>([]); // 存储评价结果
    const [evaluationres, setEvaluationres] = useState<any>([]); // 存储评价结果
    const [getPDF, setGetPDF] = useState(false); // 导出pdf的状态，true为正在导出
    const [percert, setPercent] = useState(0); // 导出进度，100完成
    const [evaluationscore, setEvaluationScore] = useState<string>('优');
    const [signature, setSignature] = useState(null);
    useEffect(() => {
        Info().then((value) => {
            if (value.roles_for_acceptance.includes(AcceptanceRole.GroupLeader)) {
                setIsGroupLeader(true);
            }
            if (value.roles_for_acceptance.includes(AcceptanceRole.ProjectLeader) ||
                value.roles_for_acceptance.includes(AcceptanceRole.SubjectLeader)) {
                setIsManager(true);
            }
        }); 
        GetEvaluationPoint().then((value) => {
            setevaluationpoint(value);
        });
        setEvaluationres(props.evaluationres);
    }, []);
    useEffect(() => {
        if (props.visible === false) {
            setEvaluations([]);
            setComment('');
        }
        if(props.evaluationscore>=9&&props.evaluationscore<=10)
        {
            setEvaluationScore('优')
        }
        if(props.evaluationscore>=8&&props.evaluationscore<9)
        {
            setEvaluationScore('良')
        }
        if(props.evaluationscore>=7&&props.evaluationscore<8)
        {
            setEvaluationScore('中')
        }
        if(props.evaluationscore>=6&&props.evaluationscore<7)
        {
            setEvaluationScore('合格')
        }
        if(props.evaluationscore<6)
        {
            setEvaluationScore('不合格')
        }
    }, [props.visible]);

    const handlesubmitclick = (values: any) => {
        if (evaluations.length < 6) {
            notification.error({ message: '请在评价等级全部选择后重新提交' });
            return 0;
        }
        if (comment === '') {
            notification.error({ message: '请在填写评价情况后重新提交' });
            return 0;
        }
        if(signature === null){
            notification.error({ message: '请在上传签字章后重新提交' });
            return 0;
        }
        CommitEvaluation(props.record.acceptance_id, evaluations, comment,signature).then(() => {
            Modal.success({
                content: '评价提交成功',
                onOk() {
                    props.onClose;
                    window.location.reload();
                },
            });
        });
    };
    const getComment = (e: any) => {
        setComment(e.target.value);
    };
    const getEvaluations = (e: any, index: number) => {
        evaluations[index] = e.target.value;
        evaluations[2] = evaluationscore;
    };

    const handleExport = () => {
        const key = props.record.cert_key;
        const url = Urls.api_cert.export_evaluation(key);
        window.open(url);
    };

    const handleUpload = (e: any) => {
        e.preventDefault();//阻止元素发生默认行为（例如，当点击提交按钮时阻止对表单的提交）
        let file = e.target.files[0];
        setSignature(file);
    }
    return (
        <div>
            <Modal
                title={null}
                visible={props.visible}
                onCancel={props.onClose}
                destroyOnClose={true}
                width='1450px'
                style={{ backgroundColor: '#F0F2F5', top: 68 }}
                footer={[
                    <Button key='cancel' onClick={props.onClose}>
                        取消
                    </Button>,
                    <Button key='submit' type='primary' htmlType='submit' onClick={handlesubmitclick} disabled={props.record.finished}>
                        提交
                    </Button>,
                ]}
            >

                {/* 只有为查看模式时才显示下载报告按钮*/}
                {
                    props.record.finished ? (
                        <div style={{ marginBottom: '10px' }}>
                            {
                                getPDF ? (
                                <Button type='primary' style={{ textAlign: 'center' }} id='submitButton' disabled>导出中,请稍候 <Spin />{percert}%</Button>
                                ) : (
                                        <Button type='primary' style={{ textAlign: 'center' }} id='submitButton' onClick={handleExport}>下载报告</Button>
                                    )
                            }
                        </div>
                    ) : (null)
                }

                <div style={{ padding: '0 20px', background: '#F0F2F5' }}>
                    <form name='VerificationReport1'>
                        <img src={logo} style={{height:'40px'}}/>
                    </form>

                    {/* 报告下载标签移至CertificateViewer内部 */}
                    <CertificateViewer cert_key={props.record.cert_key} />

                    {/* 报告下载标签移至EvaluationItemViewer内部 */}
                    <div style={{ background: '#F0F2F5' }}>
                        {/* 自己的评价 */}
                        {/* <form name='VerificationReport1'> */}
                            <div>
                                {props.record.finished === false ? // 未完成时填写评价
                                    <div style={{overflowY:'auto'}}>
                                        {
                                            isGroupLeader === true || isManager === true ? // 用户为组长时显示其他专家评价内容 项目课题负责人也显示
                                                <div>
                                                    <EvaluationItemViewer data={props.evaluationres} />
                                                </div> : null
                                        }
                                        <div className='card_eva' style={{ background: 'white' }}>
                                            <div className='table_row_eva'>
                                                <div className='table_eva' style={{ borderRadius: '8px 0 0 0', width: '10%' }}>序号</div>
                                                <div className='table_eva' style={{ width: '55%' }}>评价条目</div>
                                                <div className='table_eva' style={{ borderRadius: '0 8px 0 0', width: '35%' }}>评价等级</div>
                                            </div>
                                        </div>
                                        {evaluationpoint.map((value: any, index: number) => { //填写评价
                                            return (
                                                
                                                <div className='card_eva'>
                                                    <div className='table_row_eva'>
                                                        <div className='header_left_eva'>{index + 1}</div>
                                                        {value.content === '综合评价' ? (
                                                        <div className='header_content_eva'>修改建议</div>
                                                        ):value.content === '评价等级' ? (
                                                            <div className='header_content_eva' style={{ background: '#81BED4', color: 'white' }}>综合评价</div>
                                                            )
                                                            : 
                                                            <div className='header_content_eva'>{value.content}</div>}

                                                        <div className='header_content_eva' style={{ width: '35%' }}>
                                                            <div>
                                                                   <Radio.Group size='small' style={{ display: 'flex', flexDirection: 'row' }} defaultValue={index===2?evaluationscore:null} onChange={(e) => getEvaluations(e, index)}>
                                                                        {value.options.map((e: any) => {                                                                         
                                                                            return (                                                                               
                                                                                <div className='header_right_eva' >
                                                                                   
                                                                                <Radio value={e} disabled={index===2?true:false} >{e}</Radio>
                                                                                    
                                                                                    </div>
                                                                            );
                                                                        }
                                                                        )}</Radio.Group>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>);
                                        })}
                                        <Row>
                                            <Input.TextArea placeholder='专家评价以及修改建议情况：（必填）' rows={4} onChange={getComment} />
                                        </Row>
                                    <div style={{float:"right",display:'flex',flexDirection:'row',marginBottom:'50px'}}>
                                        <p >点击上传验收专家签名章图片：支持.jpg/.jpeg/.png/.bmp格式</p>
                                        <input type="file" name = "file" id ="file" onChange={handleUpload} accept="image/jpg,image/jpeg,image/png,image/bmp"/>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                    <EvaluationItemViewer data={props.evaluationres} /> {/* 已完成时显示所有评价结果 */}
                                    </div>
                                }
                            </div>
                        {/* </form> */}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

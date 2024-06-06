import {Button, Form, Input, Modal, notification, Popconfirm, Radio, Select} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import React, {FC, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {WithSession, withSession} from '../../../context/withSession';
import {ApplyVerificationApi, GetGroupLeaders} from '../../../../apis/certificate/Apply';
import {MgeError} from '../../../../apis/Fetch';

export const Verification: FC<FormComponentProps & WithSession & RouteComponentProps> = (props) => {
    const [submitting, setSubmitting] = useState(false); // 是否正在提交
    const handleSubmit = (e: React.FormEvent<any>) => {
        setSubmitting(true);
        e.preventDefault();
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err){
                const  params = {
                    is_project: values.is_project,
                    ps_id : values.ps_id,
                    group_leader_username: values.group_leader_username,
                };
                ApplyVerificationApi(params).then(res => {
                    setModalVisible(true);
                    setSubmitting(false);
                }).catch(() => {
                    setSubmitting(false);
                });
            }
        });
    };
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [leaderNames, setLeaderNames] = useState([]);
    const getFieldDecorator = props.form.getFieldDecorator;
    const handleCancel = () => {
        setModalVisible(false);
    };
    useEffect(()=>{
        GetGroupLeaders().then(res => {
            setLeaderNames(res);
            setLoading(false);
        }).catch(res => {
            notification.error({
                message: res.message,
            });
        })
    }, [])
    return(
        <div style={{width: '100%'}}>
            <div>
                <Form style={{width: '40%', margin: 'auto', display: 'flex', flexDirection: 'column', paddingTop: '100px' }}>
                    <Form.Item label='请选择项目或课题' style={{display: 'flex'}} labelCol={{span: 8}} wrapperCol={{span: 16}}>
                        {
                            getFieldDecorator('is_project')(
                                <Radio.Group>
                                    <Radio value={true}>项目</Radio>
                                    {/*<Radio value={false}>课题</Radio>*/}
                                </Radio.Group>,
                            )
                        }
                    </Form.Item>
                    {
                        props.form.getFieldValue('is_project') == null ? (<div></div>) : (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <Form.Item style={{display: 'flex'}} label={
                                    props.form.getFieldValue('is_project') === true ? '请输入项目编号' :
                                        '请输入课题编号'} labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                    {
                                        getFieldDecorator('ps_id', {
                                            rules: [{ required: true, message: '不能为空' }],
                                        })(
                                            <Input/>,
                                        )
                                    }
                                </Form.Item>
                                <Form.Item label='请选择评价组长' labelCol={{span: 8}} wrapperCol={{span: 16}}
                                           style={{display: 'flex'}}>
                                    {
                                        getFieldDecorator('group_leader_username', {
                                            rules: [{ required: true, message: '不能为空' }],
                                        })(
                                            <Select loading={loading} >
                                                {
                                                    leaderNames.map(item=>{
                                                        return(<Select.Option value={item.username}>{item.name}</Select.Option>)
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                                <div>
                                    {
                                        submitting ? <Button type='primary' onClick={handleSubmit} disabled>正在提交</Button>
                                            :
                                            <Button type='primary' onClick={handleSubmit}>提交</Button>
                                    }
                                </div>
                            </div>
                        )
                    }
                </Form>
            </div>
            <Modal
                visible={modalVisible}
                footer={[
                    // <Button onClick={handleCancel}>取消</Button>,
                    <Button key='submit' type='primary' onClick={()=>{window.location.reload()}}>
                        {/*<a href='/task'>*/}
                            确认
                        {/*</a>*/}
                    </Button> ]}>
                <div>
                    申请提交成功
                </div>
            </Modal>
        </div>
    );
};

export const ApplyVerification = Form.create({ name: 'ApplyVerification' })(withSession(Verification));

import {Button, Form, Input, Radio, Modal, notification} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { FC, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {WithSession, withSession} from '../../../context/withSession';
import {ApplyCertificationApi} from '../../../../apis/certificate/Apply';
import { MgeError } from '../../../../apis/Fetch';
import { AcceptanceRoleCheckWrapper } from '../../../layout/AcceptanceRoleCheckWrapper';

export const _Cert: FC<FormComponentProps & WithSession & RouteComponentProps> = (props) => {
    const [submitting, setSubmitting] = useState(false); // 是否正在提交
    const getFieldDecorator = props.form.getFieldDecorator;
    const [modalVisible, setModalVisible] = useState(false);
    const handleCancel = () => {
        setModalVisible(false);
    }
    const handleSubmit = (e: React.FormEvent<any>) => {
        setSubmitting(true);
        e.preventDefault();
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err){
                const  params = {
                    is_project: values.is_project,
                    ps_id : values.ps_id,
                };
                ApplyCertificationApi(params).then(res => {
                    setModalVisible(true);
                    setSubmitting(false);
                }).catch(() => {
                    setSubmitting(false);
                });
            }
        })
    }
    return(
        <div style={{width: '100%'}}>
            <div>
                <Form style={{width: '40%', margin: 'auto', display: 'flex', flexDirection: 'column', paddingTop: '100px' }}>
                    <Form.Item label='请选择项目或课题' style={{display:'flex'}}>
                        {
                            getFieldDecorator('is_project')(
                                <Radio.Group>
                                    <Radio value={true}>项目</Radio>
                                    <Radio value={false}>课题</Radio>
                                </Radio.Group>
                            )
                        }
                    </Form.Item>
                    {
                        props.form.getFieldValue('is_project') == null ? (<div></div>) : (
                            <div style={{display:'flex', flexDirection: 'column'}}>
                                <Form.Item style={{display:'flex'}} label={
                                    props.form.getFieldValue('is_project') === true ? '请输入项目编号' :
                                        '请输入课题编号'
                                }>
                                    {
                                        getFieldDecorator('ps_id', {
                                            rules: [{ required: true, message: '不能为空' }]
                                        })(
                                            <Input/>
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
                    <Button onClick={handleCancel}>取消</Button>,
                    <Button key="submit" type="primary">
                        <a href='/task'>
                            确认
                        </a>
                    </Button> ]}
            >
                <div>
                    申请提交成功，点击确认按钮可跳转至任务页面查看申请进度
                </div>
            </Modal>
        </div>
    );
};
export const ApplyCertification = Form.create({ name: 'cert' })(withSession(_Cert));

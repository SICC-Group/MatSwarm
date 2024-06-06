import React, { FC, useEffect, useState } from 'react';
import { Layout, Table, Button, Modal, Form, Input, notification, Tag } from 'antd';
import { RouteComponentProps } from "react-router";
import { withSession, WithSession } from '../../../context/withSession';
import { FormattedMessage } from 'react-intl';
import { FLApiFetch } from '../../../../apis/Fetch';

const { Header, Content } = Layout;

const initialNodes = [
    { key: '1', name: 'peer0.org1.example.com', status: 0 },
    { key: '2', name: 'peer0.org2.example.com', status: 1 }
];

export const _Syconfig: FC<RouteComponentProps & WithSession> = (props) => {
    const [nodes, setNodes] = useState(initialNodes);
    const [tasks, setTasks] = useState([]); // 新增
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [orgName, setOrgName] = useState('Org1');

    useEffect(() => {
        FLApiFetch(`http://127.0.0.1:9001/api/v1/task/getInitiateTasks?orgName=${orgName}`, 'GET').then((value)=>{
            setTasks(value.data.tasks);
        })
        // setTasks(
        //     [
        //         {
        //           "task_id": "1713852468385451800",
        //           "name": "TestTask_test6",
        //           "description": "TestDescription",
        //           "task_status": 0
        //         },
        //         {
        //           "task_id": "1713852488746093200",
        //           "name": "TestTask_test7",
        //           "description": "TestDescription",
        //           "task_status": 2
        //         },
        //         {
        //           "task_id": "1713862439431048800",
        //           "name": "TestTask_test7",
        //           "description": "TestDescription",
        //           "task_status": 0
        //         }
        //       ]
        // )
    }, []);

    const taskColumns = [
        { title: <FormattedMessage id='Channel_ID' defaultMessage="通道ID" />, dataIndex: 'task_id', key: 'task_id' },
        { title: <FormattedMessage id='Channel_name' defaultMessage="通道名称" />, dataIndex: 'name', key: 'name' },
        { title: <FormattedMessage id='Channel_overview' defaultMessage="通道概述" />, dataIndex: 'description', key: 'description' },
    ];

    const showAddNodeModal = () => {
        setIsModalVisible(true);
    };

    const handleAddNode = (values: any) => {
        // 实际项目中，这里应该调用API来添加节点
        setNodes([...nodes, { key: String(nodes.length + 1), name: values.name, status: 1 }]);
        setIsModalVisible(false);
        notification.success({ message: 'Node added successfully!' });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const removeNode = (key: any) => {
        // 实际项目中，这里应该调用API来移除节点
        setNodes(nodes.filter(node => node.key !== key));
        notification.success({ message: 'Node removed successfully!' });
    };

    const columns = [
        { title: <FormattedMessage id='name' defaultMessage="名称" />, dataIndex: 'name', key: 'name' },
        { title: <FormattedMessage id='dash:status' defaultMessage="状态" />, key: 'status', render:(text:any, record:any) =>{
            return record.status === 1 ? <Tag color="green"><FormattedMessage id='dash:running' defaultMessage="启用" /></Tag> : <Tag color="red"><FormattedMessage id='deactivate' defaultMessage="禁用" /></Tag>
        } },
        {
            title: <FormattedMessage id='dash:action' defaultMessage="操作" />, key: 'action',
            render: (_: any, record: { key: React.Key }) => (
                <Button onClick={() => removeNode(record.key)} >
                    <FormattedMessage id='Exit_Node' defaultMessage="退出节点" />
                </Button>
            )
        }
    ];



    return (
        <Layout>
            <Header style={{ color: 'white', fontSize: 20 }}><FormattedMessage id='PlatformConfig' defaultMessage="平台配置" /></Header>
            <Content style={{ padding: '50px', backgroundColor: 'white' }}>
                <Button type="primary" onClick={showAddNodeModal}>
                    <FormattedMessage id='new_node' defaultMessage="添加新节点" />
                </Button>
                <Table dataSource={nodes} columns={columns} style={{ marginTop: 16 }} />
                <Table dataSource={tasks} columns={taskColumns} style={{ marginTop: 16 }} />
                <Modal title={<FormattedMessage id='new_node' defaultMessage="添加新节点" />} visible={isModalVisible} onCancel={handleCancel} footer={null}>
                    <Form onChange={handleAddNode}>
                        <Form.Item className="name" label="节点名称" >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                <FormattedMessage id='new_node' defaultMessage="添加新节点" />
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};


export const Syconfig = withSession(_Syconfig)

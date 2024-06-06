import React, { FC, useEffect, useState } from 'react';
import { Table, Button, notification } from 'antd';
import { RouteComponentProps } from "react-router";
import { withSession, WithSession } from '../../../context/withSession';
import { FormattedMessage } from 'react-intl';
import { FLApiFetch } from '../../../../apis/Fetch';




export const _TaskInventory: FC<RouteComponentProps & WithSession> = (props) => {
    const [org, Setorg] = useState("Org1")
    const [tasks, setTasks] = useState([
        {
            key: '1',
            name: 'Predicting the formation  energy of perovskites',
            description: 'Train a model to predict the formation energy of perovskites, obtaining both the prediction accuracy and feature importance analysis results.',
            task_status: 2,
            operation: 'completed',
        },
    ]);


    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        FLApiFetch(`http://localhost:9001/api/v1/task/getInitiateTasks?orgName=${org}`).then((value) => {
            setTasks(value.data.tasks);
        })

    };

    const handleStartTraining = (taskId: string) => {
        // 这里实现开始训练的逻辑
        FLApiFetch(`http://localhost:9001/api/v1/task/start_multi?taskID=${taskId}`, 'POST')
        notification.success({
            message: <FormattedMessage id='Submitted_successfully' defaultMessage="任务名称" />,
            description: <FormattedMessage id='has_started' defaultMessage="您的任务已经开始训练。" />,
        });
    };

    const handleViewResults = (taskId: any) => {
        window.location.href = `/dashboard/#/trainresults?taskID=${taskId}`;
    };

    const columns = [
        {
            title: <FormattedMessage id='TaskName' defaultMessage="任务名称" />,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: <FormattedMessage id='TaskDesc' defaultMessage='任务描述' />,
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: <FormattedMessage id='TaskStatus' defaultMessage='任务状态' />,
            key: 'task_status',
            render: (text: string, record: any) => {
                if (record.task_status === 0) {
                    return <span style={{ color: 'green' }}><FormattedMessage id='Waiting_for_confirmation' defaultMessage='等待邀请方确认' /></span>
                } else if (record.task_status === 1) {
                    return <span style={{ color: 'red' }}><FormattedMessage id='Get_ready' defaultMessage='准备开始训练' /></span>
                } else {
                    return <span style={{ color: 'blue' }}><FormattedMessage id='Training_completed' defaultMessage='训练完成' /></span>
                }
            }
        },
        {
            title: <FormattedMessage id='dash:action' defaultMessage='操作' />,
            key: 'action',
            render: (_: any, record: any) => ( 
                <>
                    <Button
                        type="primary"
                        onClick={() => handleStartTraining(record.task_id)}
                        disabled={record.task_status == 2} // 根据任务状态判断开始训练按钮是否可用
                        style={{ marginRight: 8 }}
                    >
                        <FormattedMessage id='StartTraining' defaultMessage='开始训练' />
                    </Button>
                    <Button
                        onClick={() => handleViewResults(record.task_id)}
                        disabled={record.task_status !== 2} // 根据任务状态判断查看结果按钮是否可用
                    >
                        <FormattedMessage id='ViewResults' defaultMessage='查看结果' />
                    </Button>
                </>
            ),
        },
    ];
    return (
        <>
            <Table dataSource={tasks} columns={columns} style={{ width: '100%' }} />
        </>
    );
};


export const TaskInventory = withSession(_TaskInventory)

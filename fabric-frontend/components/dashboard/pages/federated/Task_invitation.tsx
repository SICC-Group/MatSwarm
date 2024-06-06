import React, { FC, useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import { withSession, WithSession } from '../../../context/withSession';
import { FormattedMessage } from 'react-intl';
import { FLApiFetch } from '../../../../apis/Fetch';


interface Task {
    key: string;
    name: string;
    description: string;
}

export const _TaskInvitation: FC<RouteComponentProps & WithSession> = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [detailData, setDetailData] = useState([]);
    const [orgname, setOrgname] = useState('Org1');
    const [recordID, setRecordID] = useState('');
    const [datasets, setDatasets] = useState([]);
    const [infomodalvisible, setInfoModalVisible] = useState(false);
    const [infodata, setInfoData] = useState({
        "ID": "1715845592845504100",
        "Name": "TestTask11",
        "Description": "TestDescription",
        "DatasetMeta": "TestDatasetMeta",
        "MLMethod": "TestMLMethod",
        "AggregationMethod": "AggregationMethod",
        "UseTEE": false,
        "InitiateOrg": "Org1",
        "InvitedOrgs": [
          "Orgs2",
          "Orgs3"
        ],
        "AcceptedOrgs": [
          "org1",
          "org2"
        ],
        "TaskStatus": 2,
        "test_dataset": "test_dataset",
        "orgs_datasets": {
          "org1": "dataset1",
          "org2": "dataset2"
        }
      });
    const TaskName = <FormattedMessage id='SelectParticipants' defaultMessage="邀请方选择" />
    // const [tasks, setTasks] = useState<Task[]>([]);
    const [tasks, setTasks] = useState([
        {
            "task_id": "1713852488746093200",
            "name": "TestTask_test7",
            "description": "TestDescription",
            "task_status": 2
        },
        {
            "task_id": "1713862439431048800",
            "name": "TestTask_test8",
            "description": "TestDescription",
            "task_status": 0
        }
    ]);

    useEffect(() => {
        // 模拟从后端接口获取数据
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        // 这里替换为你的后端接口URL
        FLApiFetch(`http://localhost:9001/api/v1/task/getInvitedTasks?orgName=${orgname}`).then((value) => {
            console.log(value);
            setTasks(value.data.tasks);
        })
    };

    const handleStartTraining = (taskId: string) => {
        // 这里实现开始训练的逻辑
        setRecordID(taskId);
        fetchDatasets();

        showModal();
        console.log(`Start training task with ID: ${taskId}`);
    };

    const fetchDatasets = async () => {
        FLApiFetch("http://localhost:8000/api/v2/storage/dataset_csv/").then((value) => {
            console.log("获取数据集", value)
            const temp = toDatasets(value.titles)
            console.log(temp)
            setDatasets(temp)

            // setDatasetDescription(value)
        })
    };

    const toDatasets = (dataset: any) => {
        const data = dataset.map((item:any) => {
            return { name: item };
        });
        return data;
    }

    const showInfoModal = (task_id:any) => {
        fetchInformation(task_id);
        setInfoModalVisible(true);
    }
    const fetchInformation = async (task_id:any) => {
        FLApiFetch(`http://127.0.0.1:9001/api/v1/task/getTask?taskID=${task_id}`).then((value) => {
            setInfoData(value)
        })
    }

    const columns = [
        {
            title: <FormattedMessage id='TaskID' defaultMessage="任务ID" />,
            dataIndex: 'task_id',
            key: 'task_id',
        },
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
            title: <FormattedMessage id='TaskInfo' defaultMessage='任务基本信息' />,
            key: 'info',
            render: (_: any, record: any) => {
                console.log(record);
                return (
                    <Button type="link" onClick={() => showInfoModal(record.task_id)}>
                        <FormattedMessage id='export:view' defaultMessage='查看' />
                    </Button>
                )
            },
        },
        {
            title: <FormattedMessage id='dash:action' defaultMessage='操作' />,
            key: 'action',
            render: (_: any, record: any) => (
                <>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleStartTraining(record.task_id)}>{<FormattedMessage id='Accept' defaultMessage='接受' />}</Button>
                    <Button type="default" onClick={() => handleDeny(record.task_id)}>{<FormattedMessage id='Deny' defaultMessage='拒绝' />}</Button>
                </>
            ),
        },
    ];

    const handleDeny = (task_id: string) => {
        const form = {
            orgName: "Org1",
            isAccepted: false,
            taskID: task_id
        }
        FLApiFetch(`http://localhost:9001/api/v1/task/handle`, 'POST', form)
    }

    // 弹窗
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        const form = {
            "orgName": "Org2",
            "isAccepted": true,
            "taskID": recordID
        }
        FLApiFetch(`http://localhost:9001/api/v1/task/handle`, 'POST', form)
        const form2 = {
            "orgName": "Org2",
            "datasetTitle": selectedRowKeys[0],
            "taskID": recordID
        }
        FLApiFetch(`http://localhost:9001/api/v1/task/selectDataset`, 'POST', form2)
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns1 = [
        { title: <FormattedMessage id='DataItemName' defaultMessage='数据集名' />, 
        dataIndex: 'name', 
        key: 'name' },

    ];

    const data = [
        { name: 'Perovskite data set 1' },
        { name: 'Perovskite data set 2' },
        { name: 'Perovskite data set 3' }
    ];

    const handleChange = (newSelectedRowKeys:any) => {
        console.log('selectedRowKeys changed to:', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: handleChange,
    };


    //数据集弹窗
    const handleRowClick = (record: any) => {
        // 假设每个数据项都有一个唯一的标识符，并且有一个获取详细数据的函数或方法
        // 这里我们直接使用示例数据
        const detail = {
            name: record.name,
            details: [
                { attribute: '属性1', value: '值1' },
                { attribute: '属性2', value: '值2' },
                { attribute: '属性3', value: '值3' }
            ]
        };
        setDetailData(detail.details);
        setIsDetailModalVisible(true);
    };

    const detailColumns = [
        { title: '属性', dataIndex: 'attribute', key: 'attribute' },
        { title: '值', dataIndex: 'value', key: 'value' }
    ];

    const translations = {
        // "ID": "任务ID",
        // "Name": "任务名称",
        // "Description": "任务描述",
        // "DatasetMeta": "数据集元数据",
        // "MLMethod": "机器学习方法",
        // "AggregationMethod": "聚合方法",
        // "UseTEE": "是否TEE",
        // "InitiateOrg": "发起组织",
        // "InvitedOrgs": "被邀请组织",
        // "AcceptedOrgs": "已接受组织",
        // "TaskStatus": "任务状态",
        // "test_dataset": "测试数据集",
        // "orgs_datasets": "组织数据集"

        "ID": "ID",
        "Name": "Task Name",
        "Description": "Task Description",
        "DatasetMeta": "DatasetMeta",
        "MLMethod": "MLMethod",
        "AggregationMethod": "AggregationMethod",
        "UseTEE": "UseTEE",
        "InitiateOrg": "InitiateOrg",
        "InvitedOrgs": "InvitedOrgs",
        "AcceptedOrgs": "AcceptedOrgs",
        "TaskStatus": "TaskStatus",
        "test_dataset": "test_dataset",
        "orgs_datasets": "orgs_datasets"
        
      };

    return (
        <>
            <Table dataSource={tasks} columns={columns} style={{ width: '100%' }} />
            <Modal
                title={<FormattedMessage id='SelectDataItems' defaultMessage="选择数据项开始训练" />}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={<FormattedMessage id='Accept' defaultMessage="确定" />}
                cancelText={<FormattedMessage id='cancel' defaultMessage="取消" />}
            >
                <Table
                    // onRow={(record) => {
                    //     return {
                    //         onClick: () => handleRowClick(record),
                    //     };
                    // }}
                    rowKey="name"
                    rowSelection={rowSelection}
                    columns={columns1}
                    dataSource={datasets}
                    pagination={false}
                />
            </Modal>
            <Modal
                title="详细内容"
                visible={isDetailModalVisible}
                onOk={() => setIsDetailModalVisible(false)}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsDetailModalVisible(false)}>
                        Close
                    </Button>
                ]}
            >
                <Table
                    columns={detailColumns}
                    dataSource={detailData}
                    pagination={false}
                />
            </Modal>

            <Modal
                title="Task Info"
                visible={infomodalvisible}
                onCancel={()=>setInfoModalVisible(false)}
                footer={[
                    <Button key="back" onClick={()=>setInfoModalVisible(false)}>
                        Close
                    </Button>
                ]}
            >
                <ul>
                    {Object.keys(infodata).map(key => { 
                        let value = infodata[key as keyof typeof infodata];
                        if (typeof value === 'object') {
                            value = JSON.stringify(value, null, 2);
                        }
                        return (
                            <li key={key}>
                                <strong>{translations[key as keyof typeof translations]}:</strong> {value} 
                            </li>
                        );
                    })}
                </ul>
            </Modal>
        </>
    )
}

export const TaskInvitation = withSession(_TaskInvitation)

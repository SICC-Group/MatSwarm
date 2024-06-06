import React, { FC, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Radio, Form, Input, Button, Select, Modal, message, Table } from 'antd';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Container } from '../components/layout/Container';
import { MgeLayout } from '../components/layout/MgeLayout';
import { MenuKey } from '../components/layout/NavMenu';
import { FormPage } from '../components/layout/FormPage';
import { FormattedMessage } from 'react-intl';
import { FLApiFetch } from '../apis/Fetch';


const FederatedComputing: FC<any> = () => {
    const [taskName, setTaskName] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string>('');
    const [datasetDescription, setDatasetDescription] = useState<string>('');
    const [initiatorInfo, setInitiatorInfo] = useState<string>('');
    const [mlMethod, setMlMethod] = useState<string>('');
    const [aggregationMethod, setAggregationMethod] = useState<string>('');
    const [teeEnabled, setTeeEnabled] = useState<boolean>(false);
    const [chosedataset, setChosedata] = useState([]);

    //弹窗
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isInvModalVisible, setIsInvModalVisible] = useState(false);
    const [isTestModalVisible, setIsTestModalVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [invselectedRowKeys, setInvSelectedRowKeys] = useState([]);
    const [testselectedRowKeys, setTestSelectedRowKeys] = useState([]);


    // 邀请方选择
    const [orgs, setOrgs] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [TestDatasets, setTestDatasets] = useState([]);
    const [invitee, setInvitee] = useState([]);
    const [chosetestdataset, setChosetestdata] = useState([]);



    useEffect(() => {
        fetchOrgs();
        fetchDatasets();
        fetchTestDatasets();
    }, []);

    const fetchOrgs = async () => {
        FLApiFetch("http://localhost:9001/api/v1/task/getOrgs").then((value) => {
            console.log("获取组织", value)
            setOrgs(value)
        })
    };

    const fetchDatasets = async () => {
        const username = "Org1"
        FLApiFetch(`http://127.0.0.1:8000/api/v2/storage/data/${username}`).then((value) => {
            console.log("获取数据集", value)
            setDatasets(value.data.datas)
        })
    };

    const fetchTestDatasets = async () => {
        FLApiFetch(`http://127.0.0.1:8000/api/v2/storage/datas/`).then((value) => {
            console.log("获取测试数据集", value)
            setTestDatasets(value.data.datas)
        })
    }

    const handleSubmit = () => {
        // Here you would handle form submission, e.g., sending data to a backend server
        localStorage.setItem('channelName', taskName);
        const fadform = {
            Name: taskName,
            Description: taskDescription,
            DatasetMeta: datasetDescription,
            initiatorInfo: initiatorInfo,
            MLMethod: mlMethod,
            AggregationMethod: aggregationMethod,
            UseTEE: teeEnabled,
            InvitedOrgs: invitee,
            InitiateOrg: 'Org1',
            OrgsTrainDatasets: chosedataset,
            TestDataset: chosetestdataset,

        }
        console.log("发送表单", fadform)
        FLApiFetch("http://127.0.0.1:9001/api/v1/task/create", "POST", fadform)
        Modal.success({
            title: 'Task submitted successfully',
            content: `Channel "${taskName}" has been successfully established`,
        });
    };

    const columns = [
        {
            title: 'Data Set ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Data Set Title',
            dataIndex: 'title',
            key: 'title',
        },
    ];

    const invcolumns = [
        {
            title: 'org Name',
            dataIndex: 'name',
            key: 'name',
        },
    ];

    const handlechange = (value: any) => {
        setChosedata(value);
        setSelectedRowKeys(value);
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: handlechange,
    };

    const handleInvchange = (value: any) => {
        setInvitee(value);
        setInvSelectedRowKeys(value);
    }

    const InvrowSelection = {
        invselectedRowKeys,
        onChange: handleInvchange,
    };

    const handleTestchange = (value: any) => {
        setChosetestdata(value);
        setTestSelectedRowKeys(value);
    }

    const rowTestSelection = {
        testselectedRowKeys,
        onChange: handleTestchange,
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const showInvModal = () => {
        setIsInvModalVisible(true);
    }

    const showTestModal = () => {
        setIsTestModalVisible(true);
    }

    const handleOk = () => {
        setIsModalVisible(false);
        setIsInvModalVisible(false);
        setIsTestModalVisible(false);
        message.success('Selections updated!');
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsInvModalVisible(false);
        setIsTestModalVisible(false);
    };

    return (
        <MgeLayout loginRequired={true} reloadOnSwitchLocale selectedMenu={MenuKey.Federated_computing}>
            <Breadcrumb items={[
                Breadcrumb.MGED,
                Breadcrumb.TaskManagement,
                Breadcrumb.Distribution]} />
            <Container>
                <FormPage
                    style={{ display: 'flex', flexDirection: 'column' }}
                    title={<FormattedMessage id='TaskSub' defaultMessage='任务下发' />}>
                    <div style={{ margin: '24px' }}>
                        <Form
                            layout="vertical"
                        // onFinish={handleSubmit}
                        >
                            <Form.Item label={<FormattedMessage id='TaskName' defaultMessage='任务名称' />}>
                                <FormattedMessage id='InputTaskName' defaultMessage='请输入任务名称'>
                                    {(msg) => <Input placeholder={msg as string} value={taskName} onChange={e => setTaskName(e.target.value)} />}
                                </FormattedMessage>

                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='TaskDesc' defaultMessage='任务描述' />}>
                                <FormattedMessage id='BriefTaskDesc' defaultMessage="请输入任务描述">
                                    {(msg) => <Input.TextArea placeholder={msg as string} value={taskDescription} onChange={e => setTaskDescription(e.target.value)} />}
                                </FormattedMessage>
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='MetaDesc' defaultMessage="数据集元数据描述" />}>
                                <FormattedMessage id='BriefDescDataset' defaultMessage="请描述数据集">
                                    {(msg) => <Input.TextArea placeholder={msg as string} value={datasetDescription} onChange={e => setDatasetDescription(e.target.value)} />}
                                </FormattedMessage>

                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='InitInfo' defaultMessage="发起方信息" />}>
                                <FormattedMessage id='BriefInitInfo' defaultMessage="请输入发起方信息">
                                    {(msg) => <Input.TextArea placeholder={msg as string} value={initiatorInfo} onChange={e => setInitiatorInfo(e.target.value)} />}
                                </FormattedMessage>

                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='LocalModel' defaultMessage="机器学习方法选择" />}>
                                <Select placeholder="请选择一种方法" value={mlMethod} onChange={(value: string) => setMlMethod(value)}>
                                    <Select.Option value="MLP">MLP</Select.Option>
                                    <Select.Option value="Lasso">Lasso</Select.Option>
                                    <Select.Option value="LSTM">LSTM</Select.Option>
                                    <Select.Option value="RNN">RNN</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='AggMethod' defaultMessage="聚合方法选择" />}>
                                <Select placeholder="请选择一种方法" value={aggregationMethod} onChange={(value: string) => setAggregationMethod(value)}>
                                    <Select.Option value="mean">mean</Select.Option>
                                    <Select.Option value="median">median</Select.Option>
                                    <Select.Option value="multi_krum">multi_krum</Select.Option>
                                    <Select.Option value="centered_clipping">centered_clipping</Select.Option>
                                    <Select.Option value="geo_med">geo_med</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='SelectDataset' defaultMessage="选取数据集" />}>
                                <Button onClick={showModal}>
                                    <FormattedMessage id='SelectDataset' defaultMessage="选取数据集" />
                                </Button>
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='SelectTestDataset' defaultMessage="选取测试数据集" />}>
                                <Button onClick={showTestModal}>
                                    <FormattedMessage id='SelectTestDataset' defaultMessage="选取测试数据集" />
                                </Button>
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='EnableTEE' defaultMessage="是否启用TEE" />}>
                                <Radio.Group onChange={(e) => setTeeEnabled(e.target.value)} value={teeEnabled}>
                                    <Radio value={true}><FormattedMessage id='yes' defaultMessage="是" /></Radio>
                                    <Radio value={false}><FormattedMessage id='no' defaultMessage="否" /></Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id='SelectParticipants' defaultMessage="邀请方选择" />}>
                                <Button onClick={showInvModal}>
                                    <FormattedMessage id='SelectParticipants' defaultMessage="邀请方选择" />
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" onClick={handleSubmit}>{<FormattedMessage id='submit' defaultMessage="提交" />}</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </FormPage>
            </Container>

            <Modal title={<FormattedMessage id='SelectDataset' defaultMessage="选取数据集" />} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Table rowKey="title" rowSelection={rowSelection} columns={columns} dataSource={datasets} />
            </Modal>

            <Modal title={<FormattedMessage id='SelectTestDataset' defaultMessage="选取测试数据集" />} visible={isTestModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Table rowKey="title" rowSelection={rowTestSelection} columns={columns} dataSource={TestDatasets} />
            </Modal>

            <Modal title={<FormattedMessage id='SelectParticipants' defaultMessage="邀请方选择" />} visible={isInvModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Table rowKey="name" rowSelection={InvrowSelection} columns={invcolumns} dataSource={orgs.map((value) => {
                    return {
                        name: value.OrgName,
                    }
                })} />
            </Modal>

        </MgeLayout>
    );
}

ReactDOM.render(<FederatedComputing />, document.getElementById('wrap'));

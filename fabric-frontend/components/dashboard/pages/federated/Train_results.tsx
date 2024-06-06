import React, { FC, useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Divider, Tabs, Descriptions, Badge } from 'antd';
import { RouteComponentProps, useParams } from "react-router";
import { Link } from 'react-router-dom';
import { withSession, WithSession } from '../../../context/withSession';
import JsonApiFetch from '../../../../apis/Fetch';
import { FormattedMessage } from 'react-intl';
import { FLApiFetch } from '../../../../apis/Fetch';

const { TabPane } = Tabs;

const testdata = {
    "results": {
        "MSE": 0.1316298097372055,
        "MAE": 0.2930043637752533,
        "RMSE": 0.3628082275390625,
        "R2": 0.8540725708007812
    },
    "images": {
        "img1": "./shap_value_bar.png",
        "img2": "./shap_value_dot.png",
        "img3": "./y_test_vs_y_pred.png"
    }
}



export const _Trainresults: FC<RouteComponentProps & WithSession> = (props) => {
    // 训练结果数据

    const [data, setData] = useState(null);
    const [tdata, setTdata] = useState({
        "metrics": "{\"MSE\": 3.462855815887451, \"MAE\": 1.4215829372406006, \"RMSE\": 1.8608750104904175, \"R2\": -2.838991403579712}",
        "shap_value_bar_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/shap_value_bar.png",
        "shap_value_dot_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/shap_value_dot.png",
        "y_test_vs_y_pred_pic": "D:\\Pycharm\\SCode\\fabric-mge-backend\\fabric-mge-backend\\apps\\fl\\FL_for_matdata\\results/1715845592845504100\\run0/y_test_vs_y_pred.png"
    });
    const [taskInfo, setTaskInfo] = useState(null);

    const queryParams = new URLSearchParams(window.location.href.split('?')[1]);
    const taskID = queryParams.get('taskID');
    useEffect(() => {
        // 替换成你的API请求地址
        FLApiFetch(`http://localhost:9001/api/v1/task/getMultiResult?taskID=${taskID}`).then((value) => {
            console.log(value);
            setTdata(value);
        })
        FLApiFetch(`http://127.0.0.1:9001/api/v1/task/getTask?taskID=${taskID}`).then((value) => {
            setTaskInfo(value);
        })
        setData(toResultData(tdata));
    }, []);

    const toResultData = (data: any) => {
        const metricsObj = JSON.parse(data.metrics);
        const testdata = {
            "results": metricsObj,
            "images": {
                "img1": data.shap_value_bar_pic.replace(/\\/g, '/'),
                // "img1": 'D:/code/matswarm/fabric-frontend/components/dashboard/pages/federated/shap_value_bar.png',
                "img2": data.shap_value_dot_pic.replace(/\\/g, '/'),
                // "img2": 'D:/code/matswarm/fabric-frontend/components/dashboard/pages/federated/shap_value_dot.png',
                "img3": data.y_test_vs_y_pred_pic.replace(/\\/g, '/')
                // "img3": 'D:/code/matswarm/fabric-frontend/components/dashboard/pages/federated/y_test_vs_y_pred.png'
            }
        };
        console.log(testdata);
        return testdata;
    }

    // const { taskID, results, images } = data;
    const { results, images } = data;

    return (
        <div style={{ width: '100%' }}>
            {/* <Card title={`Training Results - ${taskID}`} bordered={false}> */}
            <Card title={`Training Results - ${taskInfo?.Name}`} bordered={false}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Statistic title="MSE" value={results.MSE.toFixed(4)} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="MAE" value={results.MAE.toFixed(4)} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="RMSE" value={results.RMSE.toFixed(4)} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="R2" value={results.R2.toFixed(4)} />
                    </Col>
                </Row>
                <Divider />

                <Descriptions title={<FormattedMessage id='DetailedInfo' defaultMessage='详细信息' />} bordered>
                    <Descriptions.Item label={<FormattedMessage id='TaskName' defaultMessage='任务名称' />} span={3}>{taskInfo?.Name}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id='TaskDesc' defaultMessage='任务描述' />} span={3}>{taskInfo?.Description}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id='MetaDesc' defaultMessage="数据集元数据描述" />} span={0}>{taskInfo?.DatasetMeta}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id='InitInfo' defaultMessage="发起方信息" />}>{taskInfo?.InitiateOrg}</Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id='LocalModel' defaultMessage="机器学习方法选择" />}>
                        {taskInfo?.MLMethod}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id='AggMethod' defaultMessage="聚合方法选择" />} >
                        {taskInfo?.AggregationMethod}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id='EnableTEE' defaultMessage="是否启用TEE" />}>
                        {taskInfo?.UseTEE ? <Badge status="processing" text="Yes" /> : <Badge status="processing" text="No" />}
                    </Descriptions.Item>
                    <Descriptions.Item label={<FormattedMessage id='InvitedParticipants' defaultMessage="参与邀请方" />}>
                        {taskInfo?.InvitedOrgs.map((org: string) => {
                            return <Badge status="success" text={org} />
                        })}
                        <Badge status="success" text="Org1" />
                        <Badge status="success" text="Org2" />
                    </Descriptions.Item>
                </Descriptions>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Scatter plot of prediction results" key="1">
                        <img
                            width="40%"
                            // src={data == null ? '' : require(data.images.img1)}
                            src={data == null ? '' : require('D:/code/matswarm/fabric-frontend/components/dashboard/pages/federated/shap_value_bar.png')}
                            alt="Scatter plot of prediction results"
                        />;
                    </TabPane>
                    <TabPane tab="Feature importance dot plot" key="2">
                        <img
                            width="40%"
                            src={data == null ? '' : require(data.images.img2)}
                            alt="Feature importance dot plot"
                        />
                    </TabPane>
                    <TabPane tab="Loss function convergence curve" key="3">
                        <img
                            width="40%"
                            src={data == null ? '' : require(data.images.img3)}
                            alt="Loss function convergence curve"
                        />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};


export const Trainresults = withSession(_Trainresults)

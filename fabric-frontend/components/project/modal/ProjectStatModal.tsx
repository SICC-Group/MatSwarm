import React, { FC, useState, useEffect } from 'react';
import { Modal, Row, Col, Spin } from 'antd';

import { TEXT } from '../../../locale/Text';
import { GetSubjectAnalytics, GetProjectAnalytics, AnalyticsData } from '../../../apis/project/Analystics';
import { ProjectTrend, ShowType } from '../../analytics/ProjectTrend';
import { DataCard } from '../../analytics/DataCard';
import { TitledCard } from '../../analytics/TitledCard';
import dataIcon from '../../../img/analytics_data.png';
import templateIcon from '../../../img/analytics_template.png';

export interface Props {
    projectID: string;
    subjectID?: string;
    beg?: number;
    visible: boolean;
    onCancle: () => void;
}

export const ProjectStatModal: FC<Props> = (props) => {
    const [analystic, setAnalystic] = useState<AnalyticsData>();
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        if (!props.visible) return;
        var date = new Date();
        var time = date.getFullYear() * 100 + date.getMonth() + 1;
        setLoading(true);
        if (props.subjectID) {
            GetSubjectAnalytics(props.projectID, props.subjectID, time, props.beg).then(value => {
                setAnalystic(value);
                setLoading(false);
            })
        }
        else {
            GetProjectAnalytics(props.projectID, time, props.beg).then(value => {
                setAnalystic(value);
                setLoading(false);
            })
        }
    }, [props.projectID, props.visible]);

    return (
        <Modal visible={props.visible} title={TEXT('project_analystic', '项目统计')} footer={null} onCancel={props.onCancle}>
            <Row>
                <Col span={12}>
                    <DataCard icon={dataIcon}
                        loading={loading}
                        value={analystic ? analystic.data_count : 0}
                        title={TEXT('analytics:data_count', '数据总量')}
                        unit={TEXT('analytics:unit_ge', '条')} />
                        {/*unit={TEXT('analytics:unit_ge', '单位/条')} />*/}
                </Col>
                <Col span={12}>
                    <DataCard icon={templateIcon}
                        loading={loading}
                        value={analystic ? analystic.template_count : 0}
                        title={TEXT('analytics:template_count', '模板总数')}
                        // unit={TEXT('analytics:unit_ge', '单位/个')} />
                        unit={TEXT('analytics:unit_ge', '个')} />
                </Col>
            </Row>
            <Row>
                <TitledCard
                    title={TEXT('analytics:trend_graph', '趋势图')}>
                    {analystic ?
                        <ProjectTrend trendData={analystic.trend} loading={loading} showType={ShowType.All} /> :
                        <ProjectTrend loading={loading} showType={ShowType.All} />}
                </TitledCard>
            </Row>
        </Modal>
    )

}

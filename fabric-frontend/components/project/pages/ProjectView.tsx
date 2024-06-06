import React, { FC, useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Card, Col, Button } from 'antd';
import { Project } from '../../../apis/define/Project';
import { GetProject } from '../../../apis/project/GetProject';
import { SubjectItem } from '../SubjectItem';
import { CreateSubjectModal } from '../modal/CreateSubjectModal';
import { CreateSubject } from '../../../apis/project/CreateSubject';
import { ProjectStatModal } from '../modal/ProjectStatModal';

const _ProjectView: FC<RouteComponentProps<{ id: string }>> = (props) => {

    const [project, setProject] = useState<Project | null>(null);
    const [analyticsVisible, setAnalyticsVisible] = useState(false);
    const [analyticsProjectID, setAnalyticdProjectID] = useState('');

    useEffect(() => {
        GetProject(props.match.params.id).then((value) => {
            setProject(value);
        });
    }, [props.match.params.id])

    const handleCancel = () => {
        setAnalyticsVisible(false);
    };
    const showAnalystics = (project_id: string) => {
        setAnalyticdProjectID(project_id);
        setAnalyticsVisible(true);
    }

    const [visible, setVisible] = useState(false);

    const handleModalOk = (id: string, name: string, institution: string, username: string) => {
        CreateSubject(props.match.params.id, id, name, institution, username).then(() => {
            GetProject(props.match.params.id).then((value) => {
                setProject(value);
            });
        })
    }
    if (project == null) {
        return <div></div>
    }
    return (
        <div>
            <Card hoverable={false} title={project.name} headStyle={{ background: 'white' }} style={{ width: '100%', marginTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '95%' }}>
                    <Col span={6}>
                        <span key='leader'>项目负责人：</span>
                        <span>{project.leader} </span>
                    </Col>
                    <Col span={6}>
                        <Button onClick={e => showAnalystics(project.id)}>项目信息统计</Button>
                    </Col>
                    <Col span={6}>
                        <span style={{ color: '#8F8F8F' }}>课题编号：</span>
                        <span style={{ color: '#8F8F8F' }}>{project.id}</span>
                    </Col>
                    <Col span={6}>
                        <Button onClick={() => setVisible(true)}>新建子课题</Button>
                    </Col>
                </div>
            </Card>
            <div style={{margin: '12px 48px', fontSize: 18}}>
                下属课题：
            </div>
            
            <div>
                {project.subjects.map(value => {
                    return (
                        <SubjectItem subject={value} projectID={project.id}/>
                    )
                })}
            </div>
            <CreateSubjectModal visible={visible} onClose={() => setVisible(false)} onOk={handleModalOk}/>
            <ProjectStatModal visible={analyticsVisible} projectID={analyticsProjectID} onCancle={handleCancel} />
        </div>
    )
}

export const ProjectView = withRouter(_ProjectView);

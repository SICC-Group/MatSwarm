import React, { FC, useState, useEffect } from 'react';
import { SubjectMembersModal } from '../modal/SubjectMembersModal';
import { ProjectStatModal } from '../modal/ProjectStatModal';

import { GetSubjectMemebers, SubjectMember } from '../../../apis/project/GetSubjectMembers';

import { AutoComplete, Button, Cascader, Col, DatePicker, Dropdown, Icon, Input, InputNumber, Menu, Modal, Pagination, Row, Select } from 'antd';
import { ChangeSubjectModalALL, CreateSubjectModal, CreateSubjectModalS } from '../modal/CreateSubjectModal';

import { GetProjectList, GetProjectAllList } from '../../../apis/project/GetProjectList';
import { GetSubjectListTest, SearchGetSubjectListTest } from '../../../apis/project/GetSubjectList';

import { Project, ProjectAll } from '../../../apis/define/Project';
import { Subject } from '../../../apis/define/Subject';
import { CreateSubject } from '../../../apis/project/CreateSubject';
import { DeleteSubject } from '../../../apis/project/DeleteSubject';

import { ChangeSubject, ChangeSubjectAll } from '../../../apis/project/ChangeSubject';

import './SubjectList.less';

const { Option } = Select;

export const SubjectList: FC = () => {
    // visible：创建课题的子窗口是否可见
    const [visible, setVisible] = useState<boolean>(false);
    // changeVisible：修改课题的子窗口是否可见
    const [changeVisible, setChangeVisible] = useState<boolean>(false);
    // changeType：修改课题的子窗口是否为ALL修改
    const [changeType, setChangeType] = useState<boolean>(false);
    // memberVisible：成员列表是否可见
    const [memberVisible, setMemberVisible] = useState(false);
    const [members, setMembers] = useState<SubjectMember[]>([]);
    const [projectID, setProjectID] = useState<string>('');
    const [subjectID, setSubjectID] = useState<string>('');
    const [subject, setSubject] = useState<Subject | null>({
        id: '',
        institution: '',
        leader: '',
        leader_contact_method: '',
        name: '',
        project_id: '',
        created_time: '',
        members_count: '',
    });

    const [subjectData, setSubjectData] = useState<Subject[]>([]);
    const [dataTotal, setDataTotal] = useState<number>(0);
    // const [username, setUsername] = useState<string>('');
    const [pageNow, setPageNow] = useState<number>(1);
    const [pageSizeNow, setPageSizeNow] = useState<number>(5);
    const [searchContet, setSearchContet] = useState<string>('lijialiang');
    // 新建课题时需要获取当前的所有项目
    const [dataSource, setDataSource] = useState<ProjectAll[]>([]);

    const [analyticsProjectID, setAnalyticsProjectID] = useState<string>("");
    const [analyticsSubjectID, setAnalyticsSubjectID] = useState<string>("");
    const [analyticsVisible, setAnalyticsVisible] = useState<boolean>(false);
    const [analyticsBegin, setAnalyticsBegin] = useState<number>();

    const showMembers = (subject_id: string) => {
        setSubjectID(subject_id);
        GetSubjectMemebers(subject_id).then((v) => {
            setMembers(v.results);
            setMemberVisible(true);
        })
    }

    useEffect(() => {
        // 获取当前用户的课题列表
        SearchGetSubjectListTest(searchContet, pageNow, pageSizeNow).then((value) => {
            setDataTotal(value.total);
            setSubjectData(value.results);
        });

        GetProjectAllList().then((value) => {        
            setDataSource(value);
        });

    }, [0]);

    // 点击创建课题
    const newSub = () => {
        setVisible(true);
    };
    // 创建课题后的  点击OK
    const test = (projectId: string, id: string, name: string, institution: string, username: string) => {
        console.log(id, name, institution, username);

        // 无法创建课题，因为要选择所属项目,暂时都放在007下
        CreateSubject(projectId, id, name, institution, username);

        location.reload();
    };

    // 点击成员管理
    const manageMem = (subject_id: string) => {
        setSubjectID(subject_id);
        setMemberVisible(true);
    };

    // 分页跳转
    const paging = (page: number, pageSize: number) => {
        setPageNow(page);
        setPageSizeNow(pageSize);
        SearchGetSubjectListTest(searchContet, page, pageSize).then((value) => {
            setSubjectData(value.results);
        });
    };

    // 删除当前课题
    const deleteSub = (project_id: string, subject_id: string) => {
        console.log(project_id, subject_id);
        DeleteSubject(project_id, subject_id);
        // paging(pageNow, pageSizeNow);
        location.reload();
    };

    // 搜索
    const searchSub = (input_con: string) => {
        // console.log(input_con);
        setSearchContet(input_con);
        SearchGetSubjectListTest(input_con, pageNow, pageSizeNow).then((value) => {
            setDataTotal(value.total);
            setSubjectData(value.results);
        });
    };

    // 点击修改课题(无论是否all) 
    const ChSub = (subjectItem: Subject, type: boolean, projectId: string, subjectId: string) => {
        console.log(subjectItem, projectId);
        setSubject(subjectItem);
        setChangeVisible(true);
        setChangeType(type);
        setSubjectID(subjectId);
        setProjectID(projectId);
    };
    // 部分修改课题
    const changeSub = (name: string, inst: string, user: string) => {
        ChangeSubject(projectID, subjectID, name, inst, user);
        location.reload();
    };
    // 全局修改
    const changeSubAll = (id: string, projectId: string, name: string, inst: string, user: string, userContact: string) => {
        // console.log('ALL', projectID, subjectID, id, projectId, name, inst, user, userContact);
        ChangeSubjectAll(projectID, subjectID, id, projectId, name, inst, user, userContact);
        location.reload();
    };

    //显示项目信息统计弹框
    const showAnalystics = (project_id: string, subject_id: string, date: string) => {
        var arr1 = date.split(" ");
        var sdate = arr1[0].split('-');
        var beg = Number(sdate[0])*100+Number(sdate[1]);
        setAnalyticsProjectID(project_id);
        setAnalyticsSubjectID(subject_id);
        setAnalyticsBegin(beg);
        setAnalyticsVisible(true);
    }

    return (
        <div>
            <div className='Top' style={{ display: 'flex' }}>
                <div className='ProjectSearch'>
                    <Input.Search size='large' placeholder='输入课题负责人或课题名称进行搜索或过滤结果'
                        addonBefore={
                            <Select defaultValue='time' style={{ width: 120 }}>
                                <Option value='time'>创建时间</Option>
                                <Option value='user'>2019</Option>
                                <Option value='user1'>2018</Option>
                            </Select>}
                        enterButton
                        onSearch={(value) => searchSub(value)}
                    />
                </div>
                {/*隐藏新建按钮*/}
                {/*<div className='NewProject'>*/}
                {/*    <Button size='large' style={{ background: '#CC6F12', color: '#FFF', fontSize: '14px' }} onClick={newSub} >新建课题</Button>*/}
                {/*</div>*/}
            </div>

            {
                subjectData.map((item) => {
                    return (
                        <div style={{ background: '#fff', clear: 'both', margin: '50px 47px 0 49px', overflow: 'hidden' }} key={item.id}>
                            <div style={{ padding: '11px 24px 11px 18px', borderBottom: '5px solid #F5F0F2', fontSize: '18px', color: '#252525' }}>
                                {item.id}/{item.name}
                                <div style={{ float: 'right' }}>
                                    <Dropdown overlay={<Menu>
                                        <Menu.Item onClick={() => deleteSub(item.project_id, item.id)} key='1'>删除课题</Menu.Item>
                                        <Menu.Item onClick={() => ChSub(item, false, item.project_id, item.id)} key='2'>部分修改</Menu.Item>
                                        <Menu.Item onClick={() => ChSub(item, true, item.project_id, item.id)} key='3'>全局修改</Menu.Item>
                                    </Menu>}>
                                        <Button onClick={() => manageMem(item.id)} style={{ background: '#236B94', color: '#FFF', fontSize: '14px' }}>
                                            成员管理 <Icon type='down' />
                                        </Button>
                                    </Dropdown>
                                </div>
                            </div>
                            <div style={{ clear: 'both', padding: '1px' }}>
                                <div style={{ float: 'left', padding: '13px 69px 13px 18px', fontSize: '16px', color: '#252525', borderBottom: '3px solid #5AA6C7' }}>课题负责人：{item.leader}</div>
                                <div style={{ float: 'left', padding: '13px 101px 13px 80px', fontSize: '16px', color: '#252525' }}>成员：{item.members_count}</div>
                                <div style={{ float: 'left', padding: '13px 78px 13px 73px', fontSize: '16px', color: '#252525' }}><Button onClick={e => showAnalystics(item.project_id, item.id, item.created_time)}>课题信息统计</Button></div>
                                <div style={{ float: 'right', padding: '13px 18px 13px 176px', fontSize: '16px', color: '#8F8F8' }}>
                                    创建时间：{item.created_time}
                                    <i style={{ color: '#FF8C00' }} className='fa fa-cog fa-fw'></i>
                                </div>
                            </div>
                        </div>

                    );
                })
            }

            {/* 判断当前数据是否为0，选择是否展示分页 */}
            {
                dataTotal ? (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <Pagination defaultCurrent={1} pageSize={pageSizeNow} total={dataTotal} onChange={(page, pageSize) => paging(page, pageSize)} />
                    </div>
                ) : (
                        <div></div>
                    )
            }

            {/* 创建课题弹框 */}
            <CreateSubjectModalS onOk={(projectId, id, name, institution, username) => test(projectId, id, name, institution, username)} visible={visible} onClose={() => setVisible(false)} dataSource={dataSource}/>
            {/* 修改课题 */}
            <ChangeSubjectModalALL
                onOk={(name, inst, user) => changeSub(name, inst, user)}
                onOkAll={(id, projectId, name, inst, user, userContact) => changeSubAll(id, projectId, name, inst, user, userContact)}
                type={changeType}
                visible={changeVisible}
                onClose={() => setChangeVisible(false)}
                subGet= {subject}
                dataSource={dataSource}
            />
            {/* 展示项目成员弹窗 */}
            <SubjectMembersModal  subjectID={subjectID} visible={memberVisible} onCancle={() => setMemberVisible(false)}></SubjectMembersModal>

            {/* 课题信息统计弹窗 */}
            <ProjectStatModal visible={analyticsVisible} projectID={analyticsProjectID} subjectID={analyticsSubjectID} beg={analyticsBegin} onCancle={() => setAnalyticsVisible(false)} />
            {/* 删除课题 */}
        </div>
    );
};

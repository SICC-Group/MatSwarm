import React, { FC, useState, useEffect } from 'react';
import { SearchInput } from '../../search/SearchInput';
import {Row, Col, Button, Input, Menu, Dropdown, Icon, message, Card, Pagination, Select} from 'antd';
import { CreateProjectModal } from '../modal/CreateProjectModal';
import { GetProjectList, GetProjectListTest, SearchGetProjectList } from '../../../apis/project/GetProjectList';
import { Project } from '../../../apis/define/Project';
import { Link } from 'react-router-dom';
import { ProjectStatModal } from '../modal/ProjectStatModal';

export interface OverviewrProps {
  // 是否显示管理员的内容
  // 当前页的数据列表
  data: Project[];
  // 数据总量
  total: number;
  // 每个页面的大小
  pageSize: number;
  // 当前页码
  page: number;

  loading?: boolean;
  onPageChange: (newPage: number) => void;

}
const onClick = () => {
  message.info(``);
};
const menu = (
  <Menu onClick={onClick}>
    <Menu.Item key='1'>2019年</Menu.Item>
    <Menu.Item key='2'>2018年</Menu.Item>
    <Menu.Item key='3'>2017年</Menu.Item>
  </Menu>
);

export const Overview: FC<OverviewrProps> = (props) => {

  const [dataSource, setDataSource] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);

  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);

  const [createprojectVisible, setcreateprojectVisible] = useState<boolean>(false);
  const [analyticsVisible, setAnalyticsVisible] = useState(false);
  const [analyticsProjectID, setAnalyticdProjectID] = useState('');
  const [searchContet, setSearchContet] = useState<string>('micl');
  const [adm,seradm] = useState(false)
  useEffect(() => {
    
    GetProjectListTest(adm, currentPage, pageSize).then((value) => {
      setTotal(value.total);
      setDataSource(value.results);
      console.log('test',value)
  });
    // console.log('This is the test case!');
  }, [props.data]);
  const showcreateprojectmodal = () => {
    setcreateprojectVisible(true);
  };
  const handleCancel = () => {
    setAnalyticsVisible(false);
    setcreateprojectVisible(false);
  };


  const handlePageChange = (currentPage: number, pageSize:number) => {
    setLoading(true);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
    GetProjectListTest(adm, currentPage, pageSize).then((value) => {
      setLoading(false);
      setDataSource(value.results);
      setTotal(value.total);
    })
  }
  

  const searchSub = (input_con: string) => {
    setSearchContet(input_con);
    SearchGetProjectList(input_con, currentPage, pageSize).then(value => {
      setTotal(value.total);
      setDataSource(value.results);
      console.log('This is the searchSub value: ', value);
    });
  };

  const showAnalystics = (project_id: string) => {
    setAnalyticdProjectID(project_id);
    setAnalyticsVisible(true);
  }

  // @ts-ignore
  return (
    <div style={{ display: 'flex', padding: '10px 10px 10px 10px' }}>
      <div style={{ display: 'inline', width: '100%', paddingLeft: '20px' }}>
        <div style={{ flexDirection: 'row', display: 'flex' }}>
             <div className='ProjectSearch'>
               <Input.Search size='large' placeholder='输入项目负责人或项目名称进行搜索或过滤结果'
                             addonBefore={
                               <Select defaultValue='time' style={{ width: 120 }}>
                                 <Select.Option value='time'>创建时间</Select.Option>
                                 <Select.Option value='user'>2019</Select.Option>
                                 <Select.Option value='user1'>2018</Select.Option>
                               </Select>}
                               enterButton
                             onSearch={(value) => searchSub(value)}
               />
             </div>
          {/*隐藏新建按钮*/}
          {/*<div>*/}
          {/*  <Button style={{ background: '#CC6F12', color: 'white', fontSize: '12pt' }} onClick={showcreateprojectmodal}>新建项目</Button>*/}
          {/*</div>*/}
          <CreateProjectModal
            visible={createprojectVisible}
            onCancel={handleCancel}
          />
          <ProjectStatModal visible={analyticsVisible} projectID={analyticsProjectID} onCancle={handleCancel} />
        </div>
        <div>

          {dataSource.map((v) => {
            const title = <Link to={`/project/${v.id}`}>{v.name}</Link>
            return (
              <div key={v.id}>
                <Card hoverable={false} title={title} headStyle={{ background: 'white' }} style={{ width: '100%', marginTop: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', width: '95%' }}>
                    <Col span={10}>
                      <span key='leader'>项目负责人：</span>
                      <span>{v.leader} </span>
                    </Col>
                    <Col span={6}>
                      <Button onClick={e => showAnalystics(v.id)}>项目信息统计</Button>
                    </Col>
                    <Col span={10}>
                      <span style={{ color: '#8F8F8F' }}>项目编号：</span>
                      <span style={{ color: '#8F8F8F' }}>{v.id}</span>
                    </Col>
                  </div>
                </Card>
              </div>);
          })}
           <Pagination
             size={'big'} pageSize={pageSize} total={total}  onChange={(page, pageSize) => handlePageChange(page, pageSize)} defaultCurrent={1}/>
        </div>
      </div>
    </div>
  )
}

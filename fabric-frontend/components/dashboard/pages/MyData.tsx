import React, { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router';

import { MyDataList } from '../../../apis/data/DataList'; // 按DOI返回数据列表
import {TemplateDataList} from '../../../apis/data/DataList'; // 按模板返回数据列表
import { Data } from '../../../apis/define/Data';
import { UserRole } from '../../../apis/define/User';
import {Info} from '../../../apis/session/Info';
import {ListDataTemplates} from '../../../apis/template/ListTemplates'; // 返回模板列表
import { RoleCheckWrapper } from '../../layout/RoleCheckWrapper';
import { DataListViewer } from '../viewer/DataListViewer';
import { DataListViewerV3 } from '../viewer/DataListViewer_v3';

function PathnameToDOIState(pathname: string): boolean {
  if (pathname.startsWith('/data/doi_true')) {
      return true;
  }
  else if (pathname.startsWith('/data/doi_false')) {
      return false;
  }
}

function GetChild(category: any[], origin_data: any[], index_outside ?: string, category_outside ?: string){
  const data_new: any[] = [];
  let i = -1;
  category.map((value, index) => {
    const temp = value.split('.');
    if (temp[0] === category_outside){
      if (temp.length > 1){
        data_new.push({
          title: temp[1],
          key: index_outside + '-' + String(index),
          children: [],
        });
        i++;
        origin_data.map((item, index_inside) => {
          if (item.category_full_path === value){
            data_new[i].children.push({
              title: item.template__title == null ? item.title: item.template__title,
              key: item.template__id == null ? item.id : item.template__id
            });
          }
        });
      }
      else {
        origin_data.map((item) => {
          if (item.category_full_path === value){
            data_new.push({
              title: item.template__title == null ? item.title: item.template__title,
              key: item.template__id == null ? item.id : item.template__id,
            });
          }
        });
      }
    }
  });
  return data_new;
}

export function TreeData(origin_data: any[]){
  const category: any[] = [];
  const category_outside: any[] = [];
  const data_new: any[] = [];
  origin_data.map((value) => {// 先提取外层
    const temp = value.category_full_path.split('.');
    if (!category_outside.includes(temp[0]))  {category_outside.push(temp[0]); }
    if (!category.includes(value.category_full_path)) {category.push(value.category_full_path); }
  });
  category_outside.map((value, index) => {
    data_new.push({
      title: value,
      key: String(index),
      children: GetChild(category, origin_data, String(index), value),
    });
  });
  return data_new;
}

export const MyData: FC<RouteComponentProps> = (props) => {
  const DOIState = PathnameToDOIState(props.location.pathname);
  const [dataSource, setDataSource] = useState<Data.RawMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [templateList, setTemplateList] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(); // 选中模板的id，-1为全部
  const selectedTemplateUpdate = (value: string) => { // 接收子组件传来的值
    setSelectedTemplate(value);
  };

  useEffect(() => {
    setLoading(true);
    if (selectedTemplate != null){
      Info().then( (res) => {
        TemplateDataList(String(selectedTemplate), pageSize, 1, [res.email], DOIState).then((value: any) => {
          if (value.results.length === 0) { setDataSource([]); }
          else {setDataSource(value.results); }
          setLoading(false);
          setTotal(value.page_count*value.page_size);
          setPageSize(value.page_size);
          setCurrentPage(value.page);
        });
      });
    }
    else {
      MyDataList(1, DOIState).then((value) => {
        setDataSource(value.results);
        setLoading(false);
        setTotal(value.total);
        setPageSize(value.page_size);
        setCurrentPage(value.page);
      });
    }
    ListDataTemplates().then((res) => {
      setTemplateList(res);
    });
  }, []);

  // useEffect(() => {
  //   setLoading(true);
  //   if (selectedTemplate != null){
  //     Info().then( (res) => {
  //       TemplateDataList(String(selectedTemplate), pageSize, 1, [res.email], DOIState).then((value: any) => {
  //         if (value.results.length === 0) { setDataSource([]); }
  //         else {setDataSource(value.results); }
  //         setLoading(false);
  //         setTotal(value.page_count*value.page_size);
  //         setPageSize(value.page_size);
  //         setCurrentPage(value.page);
  //       });
  //     });
  //   }
  //   else {
  //     MyDataList(1, DOIState).then((value) => {
  //       setDataSource(value.results);
  //       setLoading(false);
  //       setTotal(value.total);
  //       setPageSize(value.page_size);
  //       setCurrentPage(value.page);
  //     });
  //   }
  // }, [selectedTemplate]);

  const handlePageChange = (page: number, subject: string) => {
    setLoading(true);
    if (selectedTemplate === null){
      MyDataList(page, DOIState, false, total, subject).then((value) => {
        setDataSource(value.results);
        setLoading(false);
        setTotal(value.total);
        setPageSize(value.page_size);
        setCurrentPage(value.page);
      });
    }
    else {
      Info().then( (res) => {
        TemplateDataList(String(selectedTemplate), pageSize, page, [res.email], DOIState).then((value: any) => {
          if (value.results.length === 0) { setDataSource([]); }
          else {setDataSource(value.results); }
          setLoading(false);
          setTotal(value.page_count*value.page_size);
          setPageSize(value.page_size);
          setCurrentPage(value.page);
        });
      });
    }
  };

  return (
    <RoleCheckWrapper
      forbidMessage={<FormattedMessage id='dashboard:my_data_forbid' defaultMessage='您没有上传模板的权限' />}
      requiredRoles={[UserRole.DataUploader]}>
      <div style={{ flexDirection: 'column', width: '100%' }}>
        <DataListViewerV3 admin
          total={total}
          DOIState={DOIState}
          pageSize={pageSize} selectedTemplate={selectedTemplate}
          page={currentPage} update={selectedTemplateUpdate}
          loading={loading} templateList={templateList}
           onPageChange={handlePageChange}
          data={dataSource} />
    
      </div>

    </RoleCheckWrapper>
  );
};

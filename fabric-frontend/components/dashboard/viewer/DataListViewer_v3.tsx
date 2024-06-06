import {Button, Divider, Select, Steps, Tree, TreeSelect} from 'antd';
import React, {Component, FC, useEffect, useState} from 'react';
import {GetCategory} from '../../../apis/certificate/GetCertificationData';
import { MyDataList, TemplateDataList } from '../../../apis/data/DataList';
import { Data } from '../../../apis/define/Data';
import {Info} from '../../../apis/session/Info';
import {DataListTableViewer} from './DataListTableViewer';
import './DataListViewer.less';

const { Option } = Select;
const {TreeNode} = Tree;
const { Step } = Steps;

export interface Result {
    acceptance_id: number;
    project_id: string;
    subjects_id: string[];
  }
  
export interface DataListViewerV3Props{
    // 是否显示管理员的内容
    admin: boolean;
    // 当前页的数据列表
    data: Data.RawMeta[];
    // 数据总量
    total: number;
    pageSize: number; // 每个页面的大小
    page: number; // 当前页码
    DOIState?: boolean;

    loading?: boolean;
    // 模板列表
    templateList?: any[];

    update ?: (value: string) => void;
    // 选中的模板
    selectedTemplate ?: string;

    onPageChange: (newPage: number, subject: string) => void;
    
}

const renderChild = (data: any, text ?: string) => {
    if (data instanceof Array) {
        const res: any[] = [];
        data.map((item) => {
            for (const key in item){
                if ( item[key] instanceof Array){
                    res.push(<TreeNode selectable={false} title={key} value={key} key={key}>{renderChild(item[key], key)}</TreeNode>);
                }
                else {
                    res.push(renderChild(item[key], key));
                }
            }
        });
        return res;
    }
    else  if (text != null) {
        return <TreeNode title={text} value={data.category_id} key={data.category_id}/>;
    }
    else {return null; }
};

const renderTreeNodes = (data: any) => {
    const result = [];
    for (const key in data){
        const flag = data[key].hasOwnProperty('category_id');
        result.push(<TreeNode selectable={flag} value={flag ? data[key].category_id : key}
                             title={key} key={flag ? data[key].category_id : key}>{renderChild(data[key])}</TreeNode>);
    }
    return result;
};

export const DataListViewerV3: FC<DataListViewerV3Props> = (props) => {

    const [innerData, setInnerData] = useState<Data.RawMeta[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState<string>(); // 选中的模板分类
    const [selectedTemplate, setSelectedTemplate] = useState<string>();
    const [dataSource, setDataSource] = useState<Data.RawMeta[]>([]);
    const [templateList, setTemplateList] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilter, setIsFilter] = useState<boolean> (false);
    useEffect(() => {
        setLoading(props.loading);
        setInnerData(props.data);
        setTotal(props.total);
        GetExpanded();
    }, [props.data, props.total]);

    const GetExpanded = () => {
        const data: string[] = [];
        props.templateList.map((item) => {
            data.push(item.key);
        });
        setExpanded(data);
    };

    const handleFilter = () => {
        setLoading(true);
        setIsFilter(true);
        Info().then( (res) => {
            TemplateDataList(selectedTemplate, props.pageSize, props.page, [res.email], props.DOIState).then((res1: any) => {
                setInnerData(res1.results);
                setPageSize(res1.page_size);
                setCurrentPage(res1.page);
                setTotal(res1.page_size * res1.page_count);
                setLoading(false);
                setCurrentStep(0);
                // setSelectedSubject('');
                // setSelectedTemplate('');
                // setSelectedCategory('');
            });
        });
    };
    const handlePageChange = (page: number, subject: string) => {
    setLoading(true);
    if (isFilter === false){
      MyDataList(page, props.DOIState, false, total, subject).then((value: any) => {
        setInnerData(value.results);
        setLoading(false);
        setTotal(value.total);
        setPageSize(value.page_size);
        setCurrentPage(value.page);
      });
    }
    else {
      Info().then( (res) => {
        TemplateDataList(String(selectedTemplate), pageSize, page, [res.email], props.DOIState).then((value: any) => {
          if (value.results.length === 0) { setDataSource([]); }
          else {setInnerData(value.results); }
          setLoading(false);
          setTotal(value.page_count * value.page_size);
          setPageSize(value.page_size);
          setCurrentPage(value.page);
        });
      });
    }
  };

    const pre = () => {
        setCurrentStep(currentStep - 1);
    };
    const next = () => {
        setCurrentStep(currentStep + 1);
    };
     
    const Step1: FC = () => {
        const [loadingT, setLoadingT] = useState(true);
        // useEffect(() => {
        //     // const temp = GetCategory(props.templateList);
        // }, []);
        const selectCategory = (value: string) => {
            setSelectedCategory(value); 
            setCurrentStep(currentStep + 1);  
            setTemplateList([]);   
            const temp: any[] = [];
            props.templateList.map((item) => {
                if (String(item.category_id) === value){
                    temp.push(item);     
                }
            });
            setTemplateList(temp);
            setSelectedTemplate('');
        }; 
       
        return (
            <div>
                <TreeSelect
                    showSearch
                    style={{width: '400px'}}
                    placeholder='选择类别筛选（可搜索）'
                    showArrow={true}
                    onChange={selectCategory}
                    treeDefaultExpandAll={!loadingT}
                    value={selectedCategory}
                    loading={loadingT}
                >
                    { renderTreeNodes(GetCategory(props.templateList))}
                </TreeSelect>
                
                <div style={{margin : '10px'}}>
                    <Divider type='vertical'/>
                    <Button type='primary' onClick={next} >下一步</Button>
                </div>
            </div>

        );
    };
    const Step2 = () => {
        const selectTemplate = (value: string) => {
            setSelectedTemplate(value);
        };
        return (
            <div>
                <Select
                    showSearch
                    style={{width: '400px'}}
                    placeholder='选择模板（需要先选择模板分类）'
                    showArrow={true}
                    optionFilterProp='children'
                    onChange={selectTemplate}
                    value={selectedTemplate}
                >
                    {
                        templateList.map((item: any) => {
                            return <Option key={item.template__id} value={item.template__id}>{item.template__title}</Option>;
                        })
                    }
                </Select>
                <div style={{margin : '10px'}}>
                    <Button type='primary' onClick={pre} >上一步</Button>
                    <Divider type='vertical'/>
                    <Button onClick={handleFilter}>筛选数据</Button>
                </div>
            </div>

        );
    };
    const StepRender = () => {
        switch (currentStep) {
            case 0 : { return <Step1/>; }
            case 1 : { return <Step2/>; }
        }
    };
    return (
        <div>
            <h3>添加筛选条件</h3>
            <div style={{margin: '20px 10px' }}>
                <Steps current={currentStep}>
                    <Step title='选择模板分类（必选）'/>
                    <Step title='选择模板（必选）'/>
                </Steps>
            </div>
            <div style={{margin: '20px 5px' }}>
                <StepRender/>
            </div>
            <DataListTableViewer loading={loading}
                                 total={total}
                                 pageSize={pageSize}
                                 admin={false}
                                 data={innerData}
                                 page={currentPage}
                                 templateList={templateList}
                                 onPageChange={handlePageChange}
                                     
            />
        </div>
       );

};

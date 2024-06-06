import {Button, Select, Steps, TreeSelect, Divider, Spin} from 'antd';
import React, {FC, useEffect, useState} from 'react';
import {GetCategory, GetDataList, GetSubjectList, GetTemplateList, Result} from '../../../apis/certificate/GetCertificationData';
import {Data} from '../../../apis/define/Data';
import {CertificationDataViewer} from '../viewer/CertificationDataViewer';

const { Option } = Select;
const { Step } = Steps;
const {TreeNode} = TreeSelect;

const renderChild = (data: any, text ?: string) => {
    if (data instanceof Array) {
        const res: any[] = [];
        data.map((item) => {
            for (const key in item){
                if ( item[key] instanceof Array){
                    res.push(<TreeNode selectable={false} title={key} value={key} key={key}>{renderChild(item[key],key)}</TreeNode>)
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
    else {return null;}
};

const renderTreeNodes = (data: any) => {
    const result = [];
    for (const key in data){
        const flag = data[key].hasOwnProperty('category_id')
       result.push(<TreeNode selectable={flag} value={flag ? data[key].category_id : key}
                             title={key} key={flag ? data[key].category_id : key}>{renderChild(data[key])}</TreeNode>);
    }
    return result;
};

export const CertificationData: FC<any> = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [result, setResult] = useState<Result[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [acceptanceId, setAcceptanceId] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [dataSource, setDataSource] = useState<Data.RawMeta[]>([]);
    const [templateList, setTemplateList] = useState([]);

    const [isExpert, setIsExpert] = useState(false);
    const [isLeader, setIsLeader] = useState(false);

    // 分页变量
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        setIsExpert(window.location.href.includes('/cert/data'));
        setIsLeader(window.location.href.includes('/acceptance/data'));
    }, []);
    useEffect(() => {
        GetSubjectList(isExpert, isLeader).then((res: any) => {    
	setResult(res.results);
        });
    }, [isExpert, isLeader]);

    const handlePageChange = (page: number) => {
        setLoading(true);
        GetDataList(acceptanceId, selectedTemplate,
            selectedCategory, selectedSubject, pageSize, page).then((res) => {
            setDataSource(res.results);
            setPageSize(res.page_size);
            setCurrentPage(res.page);
            setTotal(res.total);
            setLoading(false);
        });

    };
    const handleFilter = () => {
        setLoading(true);
        GetDataList(acceptanceId, selectedTemplate,
            selectedCategory, selectedSubject).then((res) => {
            setDataSource(res.results);
            setPageSize(res.page_size);
            setCurrentPage(res.page);
            setTotal(res.total);
            setLoading(false);
            setCurrentStep(0);
            // setSelectedSubject('');
            // setSelectedTemplate('');
            // setSelectedCategory('');
        });
    };
    const pre = () => {
      setCurrentStep(currentStep - 1);
    };
    const next = () => {
        setCurrentStep(currentStep + 1);
    };
    // 选择项目
    const Step1: FC = () => {
        const selectProject = (value: string) => {
            setAcceptanceId(value);
            setCurrentStep(currentStep + 1);
            setSelectedCategory(''); // 因为有切换上一步、下一步的操作，这里必须置空，防止数据错乱
            setSelectedTemplate('');
        };
        return (
            <div>
                <Select
                    showSearch
                    style={{width: '400px'}}
                    placeholder='选择项目筛选（可搜索）'
                    showArrow={true}
                    onChange={selectProject}
                    value={acceptanceId}
                    optionFilterProp='children'>
                    {
                        result.map((item) => {
                            return  <Option key={item.acceptance_id} title={item.project_id}
                                            value={item.acceptance_id}>{item.project_id}</Option>;
                        })
                    }
                </Select>
                <div style={{margin : '10px'}}>
                    <Button type='primary' onClick={next} style={acceptanceId === '' ? {display: 'none'} : {}}>下一步</Button>
                </div>
            </div>
        );
    };
    const Step2: FC = () => {
        const [list, setList] = useState([]);
        const [categoryTree, setCategoryTree] = useState({});
        const [loadingT, setLoadingT] = useState(true);
        useEffect(() => {
            GetTemplateList( Number(acceptanceId), isExpert, isLeader).then((res: any) => {
                setList(res.results.templates);
                const temp = GetCategory(res.results.templates);
                setCategoryTree(temp);
                setLoadingT(false);
            });
        }, []);
        const selectCategory = (value: string) => {
            setSelectedCategory(value);
            setCurrentStep(currentStep + 1);
            let temp: any[] = [];
            list.map((item) => {
                if (String(item.category_id) === value){
                    temp.push(item);
                }
            });
            setTemplateList(temp);
            setSelectedTemplate('');
        };
        return (
            <div>
                {/*此处加载时间较长，加个Spin特效*/}
                <Spin spinning={loadingT} style={{width: '400px'}}>
                    <TreeSelect
                        showSearch
                        style={{width: '400px'}}
                        placeholder='选择类别筛选（可搜索）'
                        showArrow={true}
                        onChange={selectCategory}
                        treeDefaultExpandAll={!loadingT}
                        value={String(selectedCategory)}
                        loading={loadingT}
                        disabled={loadingT}
                    >
                        { renderTreeNodes(categoryTree)}
                    </TreeSelect>
                </Spin>
                <div style={{margin : '10px'}}>
                    <Button type='primary' onClick={pre} >上一步</Button>
                    <Divider type='vertical'/>
                    <Button type='primary' onClick={next} >下一步</Button>
                </div>
            </div>

        );
    };
    const Step3 = () => {
        const selectTemplate = (value: string) => {
            setSelectedTemplate(value);
        };
        return (
            <div>
                <Select
                    showSearch
                    style={{width: '400px'}}
                    placeholder='选择模板'
                    showArrow={true}
                    optionFilterProp='children'
                    onChange={selectTemplate}
                    value={selectedTemplate}
                >
                    {
                        templateList.map((item: any) => {
                            return <Option key={item.id} value={item.id}>{item.title}</Option>;
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
            case 2 : { return <Step3/>; }
        }
    };
    return (
        <div>
            <h3>添加筛选条件</h3>
            <div style={{margin: '20px 10px' }}>
                <Steps current={currentStep}>
                    <Step title='选择项目（必选）'/>
                    <Step title='选择模板分类（非必选）'/>
                    <Step title='选择模板（非必选）'/>
                </Steps>
            </div>
            <div style={{margin: '20px 5px' }}>
                <StepRender/>
            </div>
            <CertificationDataViewer loading={loading}
                                     total={total}
                                     pageSize={pageSize}
                                     currentPage={currentPage}
                                     dataSource={dataSource}
                                     onPageChange={handlePageChange}
            />
        </div>
    );
};

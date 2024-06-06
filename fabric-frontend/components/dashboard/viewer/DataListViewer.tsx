import React, {Component, FC, useEffect, useState} from 'react';
import {Button, Card, Pagination, Row, Col, Checkbox, Popconfirm, Spin, Divider, notification, Tree} from 'antd';
import {Link} from 'react-router-dom'

import { Data } from '../../../apis/define/Data';
import { DOIFormModal } from '../modal/DOIFormModal';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ExportData } from '../../../apis/export/ExportData';
import { DeletData } from '../../../apis/data/Delet';
import { MyDataList } from '../../../apis/data/DataList';
import { TEXT } from '../../../locale/Text';
import { Urls } from '../../../apis/Urls';
import {MgeError} from "../../../apis/Fetch";
import './DataListViewer.less'

const {TreeNode} = Tree;

export interface DataListViewerProps{
    // 是否显示管理员的内容
    admin: boolean;
    // 当前页的数据列表
    data: Data.RawMeta[];
    // 数据总量
    total: number;
    // 每个页面的大小
    pageSize: number;
    // 当前页码
    page: number;

    loading?: boolean;
    // 模板列表
    templateList?: any[];

    update ?: (value: string) => void;
    // 选中的模板
    selectedTemplate ?: string;

    onPageChange: (newPage: number) => void;
    
}
interface CategoryBlockProps {
    selected?: boolean;
    style?: React.CSSProperties;
    title: string | JSX.Element;
    onClick?: () => void;
}

class CategoryBlock extends Component<CategoryBlockProps> {
    render() {
        return (
            <div onClick={this.props.onClick}  style={this.props.style}
                className={`category-block ${this.props.selected ? 'selected' : ''}`}>
                {this.props.title}
            </div>
        );
    }
}

export const DataListViewer: FC<DataListViewerProps> = (props) => {

    const [innerData, setInnerData] = useState<Data.RawMeta[]>([]);
    const [allData, setAllData] = useState<Data.RawMeta[]>([])
    const [doiVisible, setDoiVisible] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedAll, setSelectedAll] = useState<boolean>(false); // 全选
    const [selectedPage, setSelectedPage] = useState<boolean>(false); // 选中当前页面
    const [expanded, setExpanded] = useState<string[]>([])
    // const [selectedTemplate, setSelectedTemplate] = useState<string>('-1') // 选中模板的id，-1为全部


    useEffect(() => {
        setInnerData(props.data);
        GetExpanded();
    }, [props.data]);

    const showModal = (e: any) => {
        window.open("/storage/data/" + e.target.value);
    };

    const showDoiModal = () => {
        setDoiVisible(true);
    };

    const handleCancel = () => {
        setDoiVisible(false);
    };
    const renderTreeNodes = (data: any[]) =>{
        return  data.map(item => {
            if (item.children) {
                item.selectable = false;
                return (
                    <TreeNode key={item.key} title={item.title}  selectable={item.selectable} className='data_list__left__wrapper__span'>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode  className = {`data_list__left__wrapper__span ${props.selectedTemplate===item.key? 'selected' : ''}`}
                             {...item} key={item.key} title={item.title} />;
        });
    }
    const GetExpanded = () => {
        let data: string[] = []
        props.templateList.map((item)=>{
            data.push(item.key)
        })
        setExpanded(data)
    }

    const selectData = (e: CheckboxChangeEvent) => {
        let loadData = JSON.parse(JSON.stringify(selectedData));
        if (e.target.checked) {
            loadData.push(e.target.value);
            if (loadData.length === innerData.length) {
                setSelectedPage(true);
            }
        }
        else {
            loadData.splice(loadData.findIndex((value: any, index: any, arr: any) => {
                return value == e.target.value;
            }), 1);
            if (loadData.length !== innerData.length) {
                setSelectedPage(false);
            }
        }
        setSelectedData(loadData);
    }

    const selectCurrentPage = (e: CheckboxChangeEvent) => {
        // 全选
        if (e.target.checked) {
            let loadData = [];
            for (let i = 0; i < innerData.length; i++) {                
                loadData.push(innerData[i].id);
            }
            setSelectedData(loadData);
        } 
        // 取消全选
        else {
            setSelectedData([]);
        }
        setSelectedPage(!selectedPage);
    }

    const selectAll = (e: CheckboxChangeEvent) => {
        if (e.target.checked) {
            setLoading(true)
            MyDataList(1,false, true, props.total).then(res =>{
                setAllData(res.results);
                setLoading(false);
            }).catch( (res: MgeError) => {
                setLoading(false);
                notification.error({
                    message: res.message,
                });
            });
        }
        else {
            setSelectedData([]);
        }
        setSelectedAll(!selectedAll);
    }
    useEffect(()=>{
        let loadData: number[] = []
        for (let i = 0 ; i < allData.length; i++){
            loadData.push(allData[i].id)
        }
        setSelectedData(loadData);
    }, [allData])

    
    const dataChecked = (evalue: any) => {
        let data_check = selectedData.findIndex((value, index, arr) => {
            return value == evalue;
        })
        let data_check_bool = (data_check !== -1)
        return data_check_bool;
    }

    const exportData = (e: any) => {
        ExportData('XLSX', Array(e.target.value), false).then((value) => {
            window.open(value.result);
        });
    }

    const informUpdate = () => {
        MyDataList(props.page).then(value => {
            setInnerData(value.results);
            setLoading(false);
        })
    }

    const deleteData = () => {
        setLoading(true);
        selectedData.forEach(DeletData);
        setSelectedData([]);
        informUpdate();
    }


    return (
        <div>
            <div className='data_list'>
                <div className='data_list__left'>
                    <CategoryBlock title={'全部数据'} style={{  borderBottom: '1px solid rgba(0,0,0,0.16)'}}
                                   selected={ props.selectedTemplate === '-1'} onClick={() => {props.update('-1')}}/>
                    <CategoryBlock title={'按模板筛选'} />
                    <div className='data_list__left__wrapper'>
                        <Tree
                            expandedKeys={expanded}
                            onExpand={expandedKeys => setExpanded(expandedKeys)}
                            onSelect={(selectedKeys)=>{selectedKeys.length > 0 ? props.update(selectedKeys[0]) : {}}}
                        >
                            {renderTreeNodes(props.templateList)}
                        </Tree>
                    </div>
                </div>
                <div className='data_list__content'>
                    <Checkbox checked={selectedPage} style={{ display: 'inline', float: 'left' }} onChange={selectCurrentPage}>选中当前页面</Checkbox>
                    {/*<Checkbox checked={selectedAll} style={{ display: 'inline', float: 'left' }} onChange={selectAll}>选中所有页面</Checkbox>*/}
                    <Button className='top_button' type='primary' style={{ marginRight: '10px' }} ><Link to="/data/doi_true">{TEXT('dash:applied_doi', '已申请DOI的列表')}</Link></Button>
                    <Button className='top_button' type='primary' style={{ marginLeft: '10px' }} ><Link to="/data/doi_false">{TEXT('dash:unapplied_doi', '未申请DOI的列表')}</Link></Button>
                    {/*<Popconfirm okText='确认' cancelText='取消' title='确认删除?' onConfirm={deleteData}><Button className='top_button' type='primary' style={{ float: 'right', marginRight: '60px' }}>{TEXT('dash:delete', '删除')}</Button></Popconfirm>*/}
                    {/*<Button className='top_button' type='primary' onClick={showDoiModal} style={{ float: 'right', marginRight: '20px' }}>{TEXT('dash:apply_for_doi', '申请DOI')}</Button>*/}
                    <Spin spinning={props.loading||loading}>
                        {innerData.map((v) => {
                            return (
                                <div key={v.id}>
                                    <Card hoverable={false} title={v.title}
                                          headStyle={{ background: '#5AA6C8', color: '#fff' }}
                                          style={{ width: '100%', marginTop: '10px' }}>
                                        <Checkbox checked={dataChecked(v.id)} id={v.id + "checkbox"} value={v.id} style={{ display: 'inline', float: 'left' }} onChange={selectData}></Checkbox>
                                        <div style={{ display: 'inline', float: 'right', width: '95%' }}>
                                            <Row>
                                                <Col span={18}>
                                                    <span>{TEXT('dash:category', '材料类别：')}</span>
                                                    <span>{v.category}</span>
                                                </Col>
                                                <Col span={6}>
                                                    <span>{TEXT('dash:original_upload_file', '原始上传文件')}</span>
                                                    <Button size='small' value={v.id} onClick={exportData}>{TEXT('dash:download', '下载')}</Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={18}>
                                                    <span>{TEXT('dash:upload_time', '提交时间：')}</span>
                                                    <span>{v.add_time}</span>
                                                </Col>
                                                <Col span={6}>
                                                    <Button size='small' type='primary' value={v.id} onClick={showModal}>{TEXT('dash:view_data_list', '查看数据')}</Button>
                                                    <Divider type='vertical'/>
                                                    <Button size='small' type='primary' ><a href={Urls.storage.edit_data_new + v.id } target='_blank'>{TEXT('dash:edit_data', '修改数据')}</a></Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <span>{TEXT('dash:platform_belong','数据来源：')}</span>
                                                    <span>{v.platform_belong}</span>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card>
                                </div>);
                        })}
                        <Pagination
                            onChange={(page) => props.onPageChange(page)}
                            current={Number(props.page)} size={'big'} pageSize={props.pageSize} total={props.total} />
                    </Spin>
                </div>
            </div>
            <DOIFormModal
                visible={doiVisible}
                onCancel={handleCancel}
                dataset={selectedData}
            />
        </div>
    )
}

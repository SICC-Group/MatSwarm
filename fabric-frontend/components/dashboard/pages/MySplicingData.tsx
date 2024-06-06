import React, { FC,useEffect, useState } from 'react';
import { DataListTableViewer } from '../viewer/DataListTableViewer';
import {Data} from '../../../apis/define/Data';
import { TEXT } from '../../../locale/Text';
import {Button, Icon, Input, Table, Tooltip, Tree} from 'antd';
import { ExportData } from '../../../apis/export/ExportData';
import { Urls } from '../../../apis/Urls';


const Column = Table.Column;  //引入表格

export declare type ColumnFilterItem = {   // 定义筛选所用数组类型
    text: React.ReactNode;
    value: string;
    children?: ColumnFilterItem[]; 
};

export const MySplicingData: FC <any> = (props) =>{
    const [loading, setLoading] = useState<boolean>(false);
    const [subject, setSubject] = useState('');

    const filters: ColumnFilterItem[] = [   // 平台筛选项目
        {
            text: TEXT('data:DISCREATE_DATA','离散数据汇交平台'),
            value: '离散数据汇交平台',
        },
        {
            text: TEXT('data:Big_SCIENTIFIC','大科学装置汇交平台'),
            value: '大科学装置汇交平台',
        },
        {
            text: TEXT('data:DATABASE_TOOL','数据库汇交工具'),
            value: '数据库汇交工具',
        },
        {
            text: TEXT('data:HIGH_THROUGHPUT_COMPUTING','高通量计算汇交平台'),
            value: '高通量计算汇交平台',
        },
    ]
    const filters_public: ColumnFilterItem[] = [    // 公开筛选项目
        {
            text:TEXT('公开'),
            value:'public',
        },
        {
            text:TEXT('dash:project','项目'),
            value:'project',
        },
        {
            text:TEXT('dash:subject','课题'),
            value:'subject',
        },
        {
            text:TEXT('个人'),
            value:'person',
        },
    ]
    const showModal = (e: any) => {
        window.open('/storage/data/' + e.target.value);
    };
    const exportData = (e: any) => {
        ExportData('XLSX', Array(e.target.value), false).then((value) => {
            window.open(value.result);
        });
    };
    const columnSubjectReset = () =>  {
        setSubject('');
        props.onPageChange(1, '');
    }

    const columnSubjectSearch = () => {
        props.onPageChange(1, subject );
    }
    const getSubjectSearchProps = <div>
        <div style={{ padding: 8 }}>
            <Input
                style={{ width: 150, marginBottom: 8, display: 'block' }}
                value={subject}
                onChange={e => setSubject(e.target.value)}
            />
            <Button
                type="primary"
                icon="search"
                size="small"
                style={{ width: 70, marginRight: 8 }}
                onClick={columnSubjectSearch}
            >
                查找
            </Button>
            <Button onClick={columnSubjectReset}  size="small" style={{ width: 70 }}>
                重置
            </Button>
        </div>
    </div>
          
    return (
        <div>
            <Table  rowKey={'id'}
                        dataSource={props.data}  loading={props.loading || loading}
                        pagination={{ total:props.total, pageSize: props.pageSize, current: Number(props.page), onChange: (current) => {props.onPageChange(current, subject); }}}>
                   
                    <Column title={TEXT('dash:ID', '编号')} dataIndex='id' key='id' />
                    <Column title={TEXT('dash:upload_time', '上传时间')} dataIndex='add_time' key='add_time' render={(text) => new Date(text).toLocaleString()}/>
                    <Column title={TEXT('dash:data_title', '数据名称')} dataIndex='title' key='title'  width={180} ellipsis={true} render={(title) => (<Tooltip placement='topLeft' title={title}>{title}</Tooltip>)}/>
                    <Column title={TEXT('dash:method', '数据来源')}  key='platform_belong' dataIndex='platform_belong'
                            filters = {filters}
                            filterIcon = {<Icon type='down' />}
                            onFilter = {(value, record: any) => record.platform_belong.toString() === value}
                    />
                    <Column title={'公开范围'} dataIndex='public_date' key='public_date' filterIcon={<Icon type='down'/>}
                            filters={filters_public}
                            onFilter={(value, record: any) => record.public_range.toString() === value}
                            render={(text, record: Data.RawMeta) => {
                                let content: React.ReactNode = null;
                                switch (record.public_range) {
                                    case 'public': content = TEXT('dash:public', '公开'); break;
                                    case 'project': content = TEXT('dash:project', '项目'); break;
                                    case 'subject': content = TEXT('dash:subject', '课题'); break;
                                    case 'person': content = TEXT('dash:person', '个人'); break;
                                }
                                return (
                                    <div>
                                        {content} <br />
                                    </div>
                                );
                            }}/>
                    <Column title={TEXT('dash:pub_date', '公开时间')} key='public_date_' dataIndex='public_date' render={(text) => new Date(text).toLocaleString()}/>
                    <Column title={TEXT('dash:subject', '课题')} key='subject' dataIndex='subject'
                            filterDropdown={getSubjectSearchProps}
                            filterIcon={<Icon type='search' />}render={(text, record: Data.RawMeta) => {
                        return (<div>{record.subject}</div>);
                    }
                    } />
                    <Column
                        width='200px'
                        title={TEXT('dash:action', '操作')}
                        key='action'
                        render={(text, record: Data.RawMeta) => {
                            return (
                                <div>
                                    <span>{TEXT('dash:original_upload_file', '原始上传文件')}</span>
                                    <Button size='small' value={record.id} onClick={exportData}>{TEXT('dash:download', '下载')}</Button>
                                    <Button size='small' type='primary' value={record.id} onClick={showModal}>{TEXT('dash:view_data_list', '查看数据')}</Button>&nbsp;
                                    <Button size='small' type='primary' ><a href={Urls.storage.edit_data_new + record.id } target='_blank'>{TEXT('dash:edit_data', '修改数据')}</a></Button>
                                </div>
                            );
                        }
                        }
                    />
                </Table>
        </div>
    )
}

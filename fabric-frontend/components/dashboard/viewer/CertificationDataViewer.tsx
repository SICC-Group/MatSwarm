import React, {Component, FC, useEffect, useState} from 'react';
import {Button, Icon, Table, Input, Divider} from 'antd';
import { Data } from '../../../apis/define/Data';
import {TEXT} from '../../../locale/Text';
import {Urls} from '../../../apis/Urls';
import {ExportData} from '../../../apis/export/ExportData';

const Column = Table.Column;
interface Props {
    loading: boolean;
    total: number;
    pageSize: number;
    currentPage: number;
    dataSource: Data.RawMeta[],
    onPageChange: (page: number,subject:string) => void,
}

export const CertificationDataViewer: FC<Props> = (props) => {
    const [subject, setSubject] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);


    const exportData = (id: any) => {
        ExportData('XLSX', Array(String(id)), false).then((value) => {
            window.open(value.result);
        });
    }
    const columnSubjectReset = () => {
        setSubject('');
        props.onPageChange(1, '');
    };
    const columnSubjectSearch = () => {
        props.onPageChange(1, subject );
      };
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
            <Table
                rowKey={'id'} loading={props.loading}
                dataSource={props.dataSource}
                pagination={{ total: props.total, pageSize: props.pageSize, current: props.currentPage,
                    onChange: (current) => {props.onPageChange(current,subject)}
                }}
            >                <Column title={TEXT('dash:ID', '编号')} dataIndex='id' key='id' />
                <Column title={TEXT('dash:data_title', '数据名称')} align='center'
                        dataIndex='title' key='title'  width='300px' ellipsis={true}/>
                <Column title={'公开范围'} align='center' dataIndex='public_date' key={'public_date' + 'id'} filterIcon={<Icon type='down'/>}
                        render={(text, record: Data.RawMeta) => {
                            let content: React.ReactNode = null;
                            switch (record.public_range) {
                                case 'public': content = TEXT('dash:public','公开'); break;
                                case 'project': content = TEXT('dash:project','项目'); break;
                                case 'subject': content = TEXT('dash:subject','课题'); break;
                                case 'person': content = TEXT('dash:person','个人'); break;
                            }
                            return (
                                <div>
                                    {content} <br />
                                </div>
                            );
                        }}/>
                <Column align='center' title={TEXT('dash:pub_date', '公开时间')} key='public_date' dataIndex='public_date' render={(text) => new Date(text).toLocaleString()}/>
                <Column align='center' title={TEXT('dash:subject', '课题')} key='subject' dataIndex='subject' filterDropdown={getSubjectSearchProps} filterIcon={<Icon type="search" />}render={(text, record:Data.RawMeta) => {
                    return (<div>{record.subject}</div>);
                }
                } />
                <Column align='center'
                    width='200px'
                    title={TEXT('dash:action', '操作')}
                    key='action'
                    render={(text, record: Data.RawMeta) => {
                        return (
                            <div>
                                <span>{TEXT('dash:original_upload_file', '原始上传文件')}</span>
                                <a onClick={()=>{exportData(record.id)}}>{TEXT('dash:download', '下载')}</a>
                                <div style={{marginTop: '5px'}}>
                                    <Button size='small' type='primary' onClick={()=>{window.open('/storage/data/' + record.id);}}>{TEXT('dash:view_data_list', '查看数据')}</Button>
                                </div>

                            </div>
                        )
                    }
                    }
                />
            </Table>
        </div>
    )
};

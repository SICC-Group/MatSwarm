import React, { FC, useEffect, useState } from 'react';
import {Table, Card, Button, Divider, notification, Popconfirm } from 'antd';
import {TEXT} from '../../locale/Text';
import { PaginationConfig } from 'antd/lib/table';
import {RevokeUploadHistory} from '../../apis/uploads/Revoke';
import {MgeError} from '../../apis/Fetch';

const Column = Table.Column;

export interface UploadsHistoryViewerProps {
    page: number;
    page_size: number;
    data: any[];
    total: number;
    loading ?: boolean;
    onPageChange: (newPage: number) => void;
}

export const UploadsHistoryViewer: FC<UploadsHistoryViewerProps> = (props) => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    useEffect(() => {
        setDataSource(props.data);
    }, [props.data]);

    const handleTableChange = (pagination: PaginationConfig) => {
        props.onPageChange(pagination.current);
    };

    const handleRevokeData = (uploadID: number) =>{
        RevokeUploadHistory(uploadID).then((res: any) => {
            location.reload();
        }).catch((reason: MgeError) => {
          notification.error({
            message: reason.message,
          })
        })
    };

    return (
        <div>
            <Table onChange={handleTableChange}
                   rowKey={'id'}
                   dataSource={dataSource}
                   loading={props.loading}
                   pagination={{ total: props.total, pageSize: props.page_size, current: props.page }}
            >
                <Column title={TEXT('dash:time', '上传时间')} dataIndex='upload_time' key='upload_time' />
                <Column title={TEXT('dash:data_count', '数据量')} dataIndex='data_count' key='data_count' />
                <Column title={TEXT('dash:uploaded_via', '上传方式')} dataIndex='upload_via' key='upload_via'
                        render={(text, record) => {
                            return (<span>{text === true ? '表单上传' : '网页上传'}</span>);
                        }} />
                <Column title={TEXT('dash:reviewer', '审核人')} dataIndex='reviewer' key='reviewer' />
                <Column title={TEXT('dash:status', '状态')} dataIndex='review_state' key='review_state' />
                <Column title={TEXT('dash:action', '操作')}  render={(text: any, record: any) => {
                    const RevokeData = <Popconfirm title={'确定撤回数据？'}  onConfirm={()=>{handleRevokeData(record.id)}}>
                        <Button type='danger'>{TEXT('dash:revoke_data', '撤回数据')}</Button></Popconfirm>;
                    const ViewData = <Button>{TEXT('data:view_data', '查看数据')}</Button>;
                    if (record.review_state === '审核通过'){
                        return ViewData;
                    }
                    else { return <div>{RevokeData}<Divider type='vertical' />{ViewData}</div>; }
                }}/>
            </Table>
        </div>
    )
}

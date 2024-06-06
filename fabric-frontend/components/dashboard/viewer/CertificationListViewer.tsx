import React, { FC, useEffect, useState } from 'react';
import { TEXT } from '../../../locale/Text';
import '../modal/EvaluationModal.less';
import {Table, Button, Popconfirm, Pagination} from 'antd';
import {PaginationConfig} from 'antd/lib/table';
import {RoleCheckWrapper} from '../../layout/RoleCheckWrapper';


export interface CertificationListViewerProps {
    // 当前页的数据列表
    data: any[];
    // 每个页面的大小
    pageSize: number;
    // 总页码
    page_count: number;
    // 当前页码
    current: number;
    // 总数
    total: number;
    loading?: boolean;
    onPageChange: (current: number) => void;
}

const Column = Table.Column;

export const CertificationListViewer: FC<CertificationListViewerProps> = (props) => {
    return(
        <RoleCheckWrapper
            forbidMessage={TEXT('dashboard:doi_review_forbid', '您没有权限')}
            requiredRoles={[]}
        >
            <Table rowKey={record => record.cert_key}
                   loading={props.loading} dataSource={props.data}
                   pagination={{ pageSize: props.pageSize, current: props.current, total:props.total,onChange:(current) => {props.onPageChange(current)} }}
            >
                
                <Column title={TEXT('dash:ps_id', '项目编号/课题编号')} dataIndex='ps_id' key='ps_id' />
                <Column title={TEXT('dash:application_time', '申请时间')} dataIndex='issue_time' key='issue_time'  />
                <Column title={TEXT('dash:expired_time', '过期时间')} dataIndex='expired_time' key='expired_time'  />
                <Column title={TEXT('dash:expired', '是否过期')} dataIndex='expired' key='expired' render={(record)=>{
                    return(
                        <div>{record === true ? TEXT('dash:expired_true', '是') : TEXT('dash:expired_false', '否')}</div>
                    )
                }}/>
                <Column title={TEXT('dash:action', '操作')} render={(record) => {
                    return(<Button><a href={'/cert/' + record.key}>{TEXT('dash:view', '查看')}</a></Button>);
                }} />
            </Table>
           
        </RoleCheckWrapper>
    )
}

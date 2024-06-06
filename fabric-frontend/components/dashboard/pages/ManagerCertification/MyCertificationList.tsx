import {Button, Table, notification} from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import {Link} from 'react-router-dom';
import {Result, Certification, GetCertificationList} from '../../../../apis/certificate/GetCertificationList';
import {MgeError} from '../../../../apis/Fetch';
import { AcceptanceState } from '../../../../apis/define/AcceptanceState';
import { RoleCheckWrapper } from '../../../layout/RoleCheckWrapper';
import {CertificationListViewer} from '../../viewer/CertificationListViewer';

export const MyCertificationList: FC<RouteComponentProps> = (props) => {
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataSource, setDataSource] = useState<Certification[]>([]);
    const [pageCount, setPageCount] = useState(3); // 总页数
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        GetCertificationList(currentPage, pageSize).then((res) => {
            setDataSource(res.data);
            setCurrentPage(res.page);
            setPageCount(res.page_count);
            setLoading(false);
            setTotal(res.page_count * res.page_size);
            
        });
    }, []);
    const handlePageChange = (current:number) => {
        GetCertificationList(current, pageSize).then((res) => {
            setDataSource(res.data);
            setCurrentPage(res.page);
            setPageCount(res.page_count);
            setLoading(false);
            setTotal(res.page_count * res.page_size);
            
        }).catch((res: MgeError) => {
            notification.error({
                message: res.message,
            });
        });
    }

    return(
        <div style={{width: '100%'}}>
            <CertificationListViewer data={dataSource} pageSize={pageSize} current={currentPage}
                                     page_count={pageCount} total={total} loading={loading}
                                     onPageChange={handlePageChange}/>
        </div>
    );
};

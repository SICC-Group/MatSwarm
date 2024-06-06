import React, { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import {Button, Table, Radio, Popconfirm} from 'antd';
import {Link} from 'react-router-dom';
import {VerificationListViewer} from '../../viewer/VerificationListViewer';
import {Verification, GetVerificationList, StateToFinished} from '../../../../apis/certificate/GetVerificationList';
import {DeleteVerification} from '../../../../apis/certificate/Delete';
import {AcceptanceRoleCheckWrapper} from '../../../layout/AcceptanceRoleCheckWrapper';
import {AcceptanceRole} from '../../../../apis/define/User';

function PathnameToState(pathname: string): number {
  if (pathname.startsWith('/verify/verification_list/part')) {
      return 0;
  }
  else {
      return -1;
  }
}

export const MyVerificationList: FC<RouteComponentProps> = (props) => {
    const currentState = PathnameToState(props.location.pathname);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataSource, setDataSource] = useState<Verification[]>([]);
    const [pageCount, setPageCount] = useState(3); // 总页数
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        GetVerificationList(currentPage, pageSize, currentState).then(res => {
            const data = res.data;
            data.map((item: any) => {
                item.finished = StateToFinished(item.state);
            });
            setPageCount(res.page_count);
            setDataSource(data);
            setCurrentPage(res.page);
            setLoading(false);
            setTotal(res.page_size * res.page_count);
        });
    }, [props.location.pathname]);

    const handleDelete = (id: string) => {
        DeleteVerification(id).then( res => {
            window.location.reload();
        }).catch(res => {

        })
    };
    const handlePageChange = (current: number) => {
        GetVerificationList(current, pageSize, currentState).then(res => {
            const data = res.data;
            data.map((item: any) => {
                item.finished = StateToFinished(item.state);
            });
            setPageCount(res.page_count);
            setDataSource(data);
            setCurrentPage(res.page);
            setLoading(false);
            setTotal(res.page_size * res.page_count);
        });
    }
    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'column'}} >
            <AcceptanceRoleCheckWrapper requiredRoles={[AcceptanceRole.ProjectLeader, AcceptanceRole.SubjectLeader]}>
                <Radio.Group size='large' value={currentState} buttonStyle='solid' style={{ textAlign: 'center' }}>
                    <Radio.Button value={0} onClick={() => props.history.push('/verify/verification_list/part')}>待验收</Radio.Button>
                    <Radio.Button value={-1} onClick={() => props.history.push('/verify/verification_list')}>全部</Radio.Button>
                </Radio.Group>
                <VerificationListViewer data={dataSource} pageSize={pageSize}
                                        page_count={pageCount} current={currentPage}
                                        onPageChange={handlePageChange} handleDelete={handleDelete}
                                        loading={loading} total={total}
                />
            </AcceptanceRoleCheckWrapper>
        </div>
    );
};

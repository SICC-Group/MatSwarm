import React, { FC, useEffect, useState } from 'react';
import { Radio, notification } from 'antd';
import { RouteComponentProps } from "react-router";

import { AcceptanceState } from '../../../apis/define/AcceptanceState';
import { CertApply, AssignCertList } from '../../../apis/certificate/AssignCertList';
import { AssignCertViewer } from '../viewer/AssignCertViewer';
import { FormattedMessage } from 'react-intl';
import { TEXT } from '../../../locale/Text';
import { MgeError } from '../../../apis/Fetch';
import { AcceptanceRoleCheckWrapper } from '../../layout/AcceptanceRoleCheckWrapper';
import { AcceptanceRole } from '../../../apis/define/User';

function PathnameToReviewState(pathname: string): AcceptanceState {
    if (pathname.startsWith('/cert/assign/dispatching')) {
        return AcceptanceState.Dispatching;
    }
    else if (pathname.startsWith('/cert/assign/leader_evaluating')) {
        return AcceptanceState.Leader_Evaluating;
    }
    else if (pathname.startsWith('/cert/assign/signature_pending')) {
        return AcceptanceState.Signature_Pending;
    }
    else {
        return -1;
    }
}

export const AssignCert: FC<RouteComponentProps> = (props) => {
    const currentStates = PathnameToReviewState(props.location.pathname);

    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState<CertApply[]>([]);

    useEffect(() => {
        setLoading(true);
        AssignCertList(currentPage, currentStates).then(value => {
            setDataSource(value.data);
            setLoading(false);
            setTotal(value.page_count * value.page_size);
            setPageSize(value.page_size);
            setCurrentPage(value.page);
        });
    }, [props.location.pathname]);

    const handlePageChange = (page: number) => {
        setLoading(true);
        AssignCertList(page, currentStates).then(value => {
            setDataSource(value.data);
            setLoading(false);
            setTotal(value.page_count * value.page_size);
            setPageSize(value.page_size);
            setCurrentPage(page);
        });
    }

    return (
        <AcceptanceRoleCheckWrapper
            forbidMessage={<FormattedMessage id='dash:assign_forbid' defaultMessage='您没有分配汇交验收的权限' />}
            requiredRoles={[AcceptanceRole.GroupLeader]}>
            <div style={{ flexDirection: 'column', width: '100%' }}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                    <Radio.Group size='large' value={currentStates} buttonStyle='solid'>
                        <Radio.Button value={0} onClick={() => props.history.push('/cert/assign/dispatching')}>{TEXT('dash:pending', '待分配')}</Radio.Button>
                        <Radio.Button value={2} onClick={() => props.history.push('/cert/assign/leader_evaluating')}>{TEXT('dash:pending', '待评价')}</Radio.Button>
                        {/* <Radio.Button value={3} onClick={() => props.history.push('/cert/assign/signature_pending')}>{TEXT('dash:pending', '等待上传签名报告')}</Radio.Button> */}
                        <Radio.Button value={-1} onClick={() => props.history.push('/cert/assign/all')}>{TEXT('dash:show_all', '全部')}</Radio.Button>
                    </Radio.Group>
                </div>
                <AssignCertViewer
                    total={total}
                    pageSize={pageSize}
                    current={currentPage}
                    loading={loading}
                    onPageChange={handlePageChange}
                    data={dataSource}
                    state={currentStates}
                />
            </div>
        </AcceptanceRoleCheckWrapper>
    )
}

import React, { FC, useEffect, useState } from 'react';
import { Radio } from 'antd';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from "react-router";

import { RoleCheckWrapper } from '../../layout/RoleCheckWrapper';
import { UserRole } from '../../../apis/define/User';
import { EvaluationState } from '../../../apis/define/EvaluationState';
import { EvaluationListViewer } from '../viewer/EvaluationListViewer';
import { DoiReviewList, DoiReviewItem } from '../../../apis/data/DoiReviewList';
import { TEXT } from '../../../locale/Text';
import { GetEvaluationList } from '../../../apis/evaluation/GetEvaluationList'
import { EvaluationListItem } from '../../../apis/evaluation/GetEvaluationList';
import { Info } from '../../../apis/session/Info';

import { AcceptanceRole } from '../../../apis/define/User';

function PathnameToEvaluationState(pathname: string): EvaluationState {
    if (pathname.startsWith('/cert/evaluation/pending')) {
        return EvaluationState.Pending;
    }
    else if (pathname.startsWith('/cert/evaluation/approved')) {
        return EvaluationState.Finished;
    }
    else {
        return EvaluationState.All;
    }
}

export const CertEvaluation: FC<RouteComponentProps> = (props) => {
    const currentState = PathnameToEvaluationState(props.location.pathname);

    // const [dataSource, setDataSource] = useState([]);
    const [dataSource, setDataSource] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // DoiReviewList(currentState, 1).then(value => {
        //     setDataSource(value.results);
        //     setLoading(false);
        //     setTotal(value.total);
        //     setPageSize(value.page_size);
        //     setCurrentPage(1);
        // })
        setLoading(true);
        GetEvaluationList(currentState,currentPage,pageSize).then((value) => {
          setLoading(false);
          setDataSource(value.data);
          setTotal(value.page_count * value.page_size);
          setCurrentPage(value.page);
          console.log(value.data)
        });
    }, [props.location.pathname]);

    const handlePageChange = (page: number) => {
        // DoiReviewList(currentState, page).then(value => {
        //     setDataSource(value.results);
        //     setLoading(false);
        //     setTotal(value.total);
        //     setPageSize(value.page_size);
        //     setCurrentPage(page);
        // })
        GetEvaluationList(currentState,page,pageSize).then((value) => {
            setLoading(false);
            setDataSource(value.data);
            setPageSize(value.page_size);
            setTotal(value.page_count * value.page_size);
            setCurrentPage(page);
            console.log(value.data)
          });
    }

    return (
        <RoleCheckWrapper
            // forbidMessage={<FormattedMessage id='dashboard:doi_review_forbid' defaultMessage='您没有汇交验收评价的权限' />}
            forbidMessage={TEXT('dashboard:doi_review_forbid', '您没有汇交验收评价的权限')}
            requiredRoles={[UserRole.DataUploader]}>
            <div style={{ flexDirection: 'column', width: '100%' }}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                    <Radio.Group size='large' value={currentState} buttonStyle='solid'>
                        <Radio.Button value={EvaluationState.Pending} onClick={() => props.history.push('/cert/evaluation/pending')}>{TEXT('dash:pending', '待评价')}</Radio.Button>
                        <Radio.Button value={EvaluationState.Finished} onClick={() => props.history.push('/cert/evaluation/approved')}>{TEXT('dash:finished', '已评价')}</Radio.Button>
                        <Radio.Button value={EvaluationState.All} onClick={() => props.history.push('/cert/evaluation/all')}>{TEXT('dash:show_all', '全部')}</Radio.Button>
                    </Radio.Group>
                </div>
                <EvaluationListViewer admin
                    total={total}
                    pageSize={pageSize}
                    current={currentPage}
                    loading={false}
                    onPageChange={handlePageChange}
                    data={dataSource} />
            </div>
        </RoleCheckWrapper>
    )
}

import React, { FC, useEffect, useState } from 'react';
import { Radio } from 'antd';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from "react-router";

import { RoleCheckWrapper } from '../../layout/RoleCheckWrapper';
import { UserRole } from '../../../apis/define/User';
import { ReviewState } from '../../../apis/define/ReviewState';
import { DoiReviewViewer } from '../viewer/DoiReviewViewer';
import { DoiReviewList, DoiReviewItem } from '../../../apis/data/DoiReviewList';
import { TEXT } from '../../../locale/Text';


function PathnameToReviewState(pathname: string): ReviewState {
    if (pathname.startsWith('/review/doi/pending')) {
        return ReviewState.Pending;
    }
    else if (pathname.startsWith('/review/doi/approved')) {
        return ReviewState.Approved;
    }
    else if (pathname.startsWith('/review/doi/disapproved')) {
        return ReviewState.Disapproved;
    }
    else {
        return ReviewState.All;
    }
}

export const DoiReview: FC<RouteComponentProps> = (props) => {
    const currentState = PathnameToReviewState(props.location.pathname);

    const [dataSource, setDataSource] = useState<DoiReviewItem[]>([]);

    const [loading, setLoading] = useState(false);

    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        DoiReviewList(currentState, 1).then(value => {
            setDataSource(value.results);
            setLoading(false);
            setTotal(value.total);
            setPageSize(value.page_size);
            setCurrentPage(1);
        })
    }, [props.location.pathname]);

    const handlePageChange = (page: number) => {
        DoiReviewList(currentState, page).then(value => {
            setDataSource(value.results);
            setLoading(false);
            setTotal(value.total);
            setPageSize(value.page_size);
            setCurrentPage(page);
        })
    }

    return (
        <RoleCheckWrapper
            forbidMessage={<FormattedMessage id='dashboard:doi_review_forbid' defaultMessage='您没有审核DOI的权限' />}
            requiredRoles={[UserRole.DOIAdmin]}>
            <div style={{ flexDirection: 'column', width: '100%' }}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                    <Radio.Group size='large' value={currentState} buttonStyle='solid'>
                        <Radio.Button value={ReviewState.Pending} onClick={() => props.history.push('/review/doi/pending')}>{TEXT('dash:pending', '等待审核')}</Radio.Button>
                        <Radio.Button value={ReviewState.Approved} onClick={() => props.history.push('/review/doi/approved')}>{TEXT('dash:approved', '审核通过')}</Radio.Button>
                        <Radio.Button value={ReviewState.Disapproved} onClick={() => props.history.push('/review/doi/disapproved')}>{TEXT('dash:disapproved', '未通过审核')}</Radio.Button>
                        <Radio.Button value={ReviewState.All} onClick={() => props.history.push('/review/doi/all')}>{TEXT('dash:show_all', '全部')}</Radio.Button>
                    </Radio.Group>
                </div>
                <DoiReviewViewer admin
                    total={total}
                    pageSize={pageSize}
                    current={currentPage}
                    loading={loading}
                    onPageChange={handlePageChange}
                    data={dataSource} 
                    currentstate={currentState}
                    />
            </div>
        </RoleCheckWrapper>
    )
}


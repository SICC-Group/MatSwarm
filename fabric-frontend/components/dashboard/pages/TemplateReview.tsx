import React, { FC, useEffect, useState } from 'react';
import { Radio } from 'antd';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from "react-router";

import { RoleCheckWrapper } from '../../layout/RoleCheckWrapper';
import { UserRole } from '../../../apis/define/User';
import { ReviewState } from '../../../apis/define/ReviewState';
import { TemplatesReviewViewer } from '../viewer/TemplatesReviewViewer';
import { TemplatesReview } from '../../../apis/define/TemplateReview';
import { ListTemplates } from '../../../apis/template/ListTemplates';
import { TEXT } from '../../../locale/Text';


function PathnameToReviewState(pathname: string): ReviewState {
    if (pathname.startsWith('/review/template/pending')) {
        return ReviewState.Pending;
    }
    else if (pathname.startsWith('/review/template/approved')) {
        return ReviewState.Approved;
    }
    else if (pathname.startsWith('/review/template/disapproved')) {
        return ReviewState.Disapproved;
    }
    else {
        return ReviewState.All;
    }
}

export const TemplateReview: FC<RouteComponentProps> = (props) => {
    const currentState = PathnameToReviewState(props.location.pathname);

    const [dataSource, setDataSource] = useState<TemplatesReview[]>([]);

    const [loading, setLoading] = useState(true);

    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        ListTemplates(currentState, 1, false).then(value => {
            setDataSource(value.results);
            setLoading(false);
            setTotal(value.count);
            setPageSize(value.page_size);
            setCurrentPage(1);
        })
    }, [props.location.pathname]);

    const handlePageChange = (page: number) => {
        ListTemplates(currentState, page, false).then(value => {
            setDataSource(value.results);
            setLoading(false);
            setTotal(value.count);
            setPageSize(value.page_size);
            setCurrentPage(page);
        })
    }

    return (
        <RoleCheckWrapper
            forbidMessage={<FormattedMessage id='dashboard:template_review_forbid' defaultMessage='您没有审核模板的权限' />}
            requiredRoles={[UserRole.TemplateAdmin]}>
            <div style={{ flexDirection: 'column', width: '100%' }}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                    <Radio.Group size='large' value={currentState} buttonStyle='solid'>
                        <Radio.Button value={ReviewState.Pending} onClick={() => props.history.push('/review/template/pending')}>{TEXT('dash:pending', '等待审核')}</Radio.Button>
                        <Radio.Button value={ReviewState.Approved} onClick={() => props.history.push('/review/template/approved')}>{TEXT('dash:approved', '审核通过')}</Radio.Button>
                        <Radio.Button value={ReviewState.Disapproved} onClick={() => props.history.push('/review/template/disapproved')}>{TEXT('dash:disapproved', '未通过审核')}</Radio.Button>
                        <Radio.Button value={ReviewState.All} onClick={() => props.history.push('/review/template/all')}>{TEXT('dash:show_all', '全部')}</Radio.Button>
                    </Radio.Group>
                </div>
                <TemplatesReviewViewer admin
                    total={total}
                    pageSize={pageSize}
                    current={currentPage}
                    loading={loading}
                    onPageChange={handlePageChange}
                    data={dataSource} />
            </div>
        </RoleCheckWrapper>
    )
}


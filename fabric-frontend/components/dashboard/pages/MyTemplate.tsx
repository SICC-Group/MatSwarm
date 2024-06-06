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
import { withSession, WithSession } from '../../context/withSession';


function PathnameToReviewState(pathname: string): ReviewState {
  if (pathname.startsWith('/template/pending')) {
    return ReviewState.Pending;
  }
  else if (pathname.startsWith('/template/approved')) {
    return ReviewState.Approved;
  }
  else if (pathname.startsWith('/template/disapproved')) {
    return ReviewState.Disapproved;
  }
  else {
    return ReviewState.All;
  }
}


export const _MyTemplate: FC<RouteComponentProps & WithSession> = (props) => {

  const currentState = PathnameToReviewState(props.location.pathname);

  const [dataSource, setDataSource] = useState<TemplatesReview[]>([]);

  const [loading, setLoading] = useState(true);

  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!props.session.fetched) {
      return;
    }
    ListTemplates(currentState, 1).then(value => {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(1);
    })
  }, [props.location.pathname, props.session.fetched]);

  const handlePageChange = (page: number) => {
    ListTemplates(currentState, page).then(value => {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(page);
    })
  }

  if (!props.session.fetched) {
    return <div></div>
  }
  else
    return (
      <RoleCheckWrapper
        forbidMessage={<FormattedMessage id='dashboard:my_template_forbid' defaultMessage='您没有上传模板的权限' />}
        requiredRoles={[UserRole.TemplateUploader]}>
        <div style={{ flexDirection: 'column', width: '100%' }}>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <Radio.Group size='large' value={currentState} buttonStyle='solid'>
              <Radio.Button value={ReviewState.Pending} onClick={() => props.history.push('/template/pending')}>{TEXT('dash:pending', '等待审核')}</Radio.Button>
              <Radio.Button value={ReviewState.Approved} onClick={() => props.history.push('/template/approved')}>{TEXT('dash:approved', '审核通过')}</Radio.Button>
              <Radio.Button value={ReviewState.Disapproved} onClick={() => props.history.push('/template/disapproved')}>{TEXT('dash:disapproved', '未通过审核')}</Radio.Button>
              <Radio.Button value={ReviewState.All} onClick={() => props.history.push('/template/all')}>{TEXT('dash:show_all', '全部')}</Radio.Button>
            </Radio.Group>
          </div>
          <TemplatesReviewViewer
            allowDelete allowEdit
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

export const MyTemplate = withSession(_MyTemplate)

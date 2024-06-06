import {Card, notification, Radio, Table} from 'antd';
import React, {Component, FC, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import {HashRouter as Router, Route} from 'react-router-dom';
import {ReviewState} from '../apis/define/ReviewState';
import Urls from '../apis/Urls';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { MgeLayout } from '../components/layout/MgeLayout';
import {TEXT} from '../locale/Text';
import {GetUploadHistoryList} from '../apis/uploads/Get';
import {UploadsHistoryViewer} from '../components/upload_history/UploadHistoryViewer';
import {MgeError} from '../apis/Fetch';
import {DataList} from '../components/upload_history/DataList';

const breadcrumbItems: BreadcrumbItem = 
  {
    title: <FormattedMessage id='user:history' defaultMessage='上传历史' />,
  }


function PathnameToReviewState(pathname: string): ReviewState {
  if (pathname.startsWith('/pending')) {
    return ReviewState.Pending;
  }
  else if (pathname.startsWith('/approved')) {
    return ReviewState.Approved;
  }
  else if (pathname.startsWith('/disapproved')) {
    return ReviewState.Disapproved;
  }
  else {
    return ReviewState.All;
  }
}

const _UploadHistory: FC<RouteComponentProps> = (props) => {
    const currentState = PathnameToReviewState(props.location.pathname);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<any[]>([]);
    useEffect(() => {
        setLoading(true);
        GetUploadHistoryList(currentState, currentPage, pageSize).then((res: any ) => {
            setLoading(false);
            setCurrentPage(res.data.current_page);
            setTotal(res.data.count);
            setDataSource(res.data.results);
        }).catch((reason: MgeError) => {
             setLoading(false);
            notification.error({
                message: reason.message
            })
        })
    },[props.location.pathname]);

    const handlePageChange = (newPage: number) => {
        setLoading(true);
        GetUploadHistoryList(currentState, newPage, pageSize).then((res: any ) => {
            setLoading(false);
            setCurrentPage(res.data.current_page);
            setTotal(res.data.count);
            setDataSource(res.data.results);
        }).catch((reason: MgeError) => {
            setLoading(false);
            notification.error({
                message: reason.message
            })
        })
    };

    return (
        <MgeLayout
            loginRequired
        >
            <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems]} />
            <Card style={{ textAlign: 'center', padding: '16px' }}>
                <Radio.Group value={currentState} size='large'  buttonStyle='solid' style = {{padding: '16px'}} >
                    <Radio.Button value={ReviewState.Pending} onClick={() => props.history.push('/pending')}>{TEXT('dash:pending', '等待审核')}</Radio.Button>
                    <Radio.Button value={ReviewState.Approved} onClick={() => props.history.push('/approved')}>{TEXT('dash:approved', '审核通过')}</Radio.Button>
                    <Radio.Button value={ReviewState.Disapproved} onClick={() => props.history.push('/disapproved')}>{TEXT('dash:disapproved', '未通过审核')}</Radio.Button>
                    <Radio.Button value={ReviewState.All} onClick={() => props.history.push('/')}>{TEXT('dash:show_all', '全部')}</Radio.Button>
                </Radio.Group>
                <UploadsHistoryViewer page={currentPage}
                                      page_size={pageSize}
                                      data={dataSource}
                                      total={total}
                                      loading={loading}
                                      onPageChange={handlePageChange}/>
            </Card>
        </MgeLayout>
    );
};
const Upload_History = withRouter(_UploadHistory);

class UploadHistory extends Component<any, any>{
    render() {
        return (
            <Router>
                {/*<Upload_History />*/}
                <Route path='/' exact component={Upload_History} />
                <Route path='/approved' exact component={Upload_History} />
                <Route path='/disapproved' exact component={Upload_History} />
                <Route path='/pending' exact component={Upload_History} />
                <Route path='/data_list/:history_id' exact component={DataList} />
            </Router>

        );
    }
}

ReactDOM.render(<UploadHistory />, document.getElementById('wrap'));

import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { Layout } from 'antd';

import Urls from '../apis/Urls';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { MgeLayout } from '../components/layout/MgeLayout';

import './dashboard_v1.less';

import { MenuKey } from '../components/layout/NavMenu';
import { HashRouter as Router, Route } from 'react-router-dom';
import { LeftNavMenu } from '../components/dashboard/LeftNavMenu';
import { DataReview } from '../components/dashboard/pages/DataReview';
import { TemplateReview } from '../components/dashboard/pages/TemplateReview';
import { DoiReview } from '../components/dashboard/pages/DoiReview';
import { AccountInfo } from '../components/dashboard/pages/AccountInfo';
import { ChangePassword } from '../components/dashboard/pages/ChangePassword';
import { MyData } from '../components/dashboard/pages/MyData';
import { MyTemplate } from '../components/dashboard/pages/MyTemplate';
import { MySnippet } from '../components/dashboard/pages/MySnippet';
import { UserRoleReview } from '../components/dashboard/pages/UserRoleReview';
import { DoiList } from '../components/dashboard/pages/Dataset';
import {DOIRegister} from '../components/dashboard/pages/DOIRegister';
import {MySplicingData} from '../components/dashboard/pages/MySplicingData';
import {MyTemplateSplicing} from '../components/dashboard/pages/MyTemplateSplicing';

// import {ApplyCertification} from '../components/dashboard/pages/ApplyCertification';
// import {ApplyVerification} from '../components/dashboard/pages/ApplyVerification';
// import {VerificationReport} from '../components/dashboard/pages/VerificationReport';
// import {MyCertificationList} from '../components/dashboard/pages/MyCertificationList';
import {ApplyVerification} from '../components/dashboard/pages/ManagerCertification/ApplyVerification';
import {ApplyCertification} from "../components/dashboard/pages/ManagerCertification/ApplyCertification";
import {MyVerificationList} from "../components/dashboard/pages/ManagerCertification/MyVerificationList";
import {MyCertificationList} from "../components/dashboard/pages/ManagerCertification/MyCertificationList";
import {CertificationData} from "../components/dashboard/pages/CertificationData";
import { AssignCert } from '../components/dashboard/pages/AssignCert';

import {ExpertEvaluateTemplate} from "../components/dashboard/pages/ExpertEvaluateTemplate";

// import { MySubject } from '../components/dashboard/pages/MySubject';
import {CertEvaluation} from '../components/dashboard/pages/Evaluation';
import { TaskInvitation } from '../components/dashboard/pages/federated/Task_invitation';
import { TaskInventory } from '../components/dashboard/pages/federated/Task_inventory';
import { Syconfig } from '../components/dashboard/pages/fabric_system/System_configuration';
import { Trainresults } from '../components/dashboard/pages/federated/Train_results';
const { Content, Sider } = Layout;

/**
 * 控制面板页面的路由
 * - 数据和模板：/dashboard/mge/{data, template, history, task}
 * - 个人信息：/dashboard/account{/, /password}
 * - 审核：/dashboard/review/{data, template, DOI, roles}
 * - 通知：/dashboard/notifications
 * - 反馈：/dashboard/feedback{ /, /new}
 * - 用户管理
 */

const breadcrumbItems: BreadcrumbItem =
  {
    title: <FormattedMessage id='TaskMgmt' defaultMessage='任务管理' />,
    url: Urls.dashboard,
  }

const DashboardV1Entry: FC = () => {

  return (
    <MgeLayout loginRequired titleID='dashboard' defaultTitle='控制面板' selectedMenu={MenuKey.Export}>
      <Breadcrumb items={[Breadcrumb.MGED,breadcrumbItems]} />
      <Router>
        <Layout style={{ padding: '16px 0', margin: '24px', background: '#fff' }}>
          <Sider width={200} style={{ background: '#fff' }}>
            <LeftNavMenu />
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280, flex: 1, display: 'flex' }}>
            <Route path='/review/data' component={DataReview} />
            <Route path='/review/template' component={TemplateReview} />
            <Route path='/review/user_role' component={UserRoleReview} />
            <Route path='/review/doi' component={DoiReview} />
            <Route path='/account/info' component={AccountInfo} />
            <Route path='/account/password' component={ChangePassword} />
            <Route path='/data' component={MyData}/>
            <Route path='/template' component={MyTemplate}/>
            <Route path='/snippet' component={MySnippet}/>
            <Route path='/dataset' component={DoiList}/>
            <Route path='/doi' component={DOIRegister}/>
            <Route path='/verify/cert' component={ApplyCertification} />
            <Route path='/verify/apply' component={ApplyVerification} />
            <Route path='/verify/certification_list' component={MyCertificationList} />
            <Route path='/verify/verification_list' component={MyVerificationList} />
            <Route path = '/cert/evaluation' component={CertEvaluation} />
            <Route path='/cert/assign' component={AssignCert} />
            <Route path='/cert/data' component={CertificationData}/>
            <Route path='/acceptance/data' component={CertificationData}/>
            <Route path='/splice/template' component={MyTemplateSplicing}/>
            <Route path='/splice/data' exact component={MySplicingData}/>
            <Route path='/template_score' component={ExpertEvaluateTemplate} />
            <Route path='/invite' component={TaskInvitation} />
            <Route path='/inventory' component={TaskInventory} />
            <Route path='/system_configuration' component={Syconfig} />
            <Route path='/trainresults' component={Trainresults} />
          </Content>
        </Layout>
      </Router>
    </MgeLayout>
  );
}


ReactDOM.render(<DashboardV1Entry />, document.getElementById('wrap'));

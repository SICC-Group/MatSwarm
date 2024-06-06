import React, { FC } from 'react';
import { Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { RouteComponentProps } from "react-router";

import { SessionContext } from '../context/session';
import { UserRole, AcceptanceRole } from '../../apis/define/User';
import { TEXT } from '../../locale/Text';
import Urls from '../../apis/Urls';

// import { DashboardKey } from './Define';

const SubMenu = Menu.SubMenu;

type Props = RouteComponentProps<{}>;

// const MyDataItemOld = (
//   <Menu.Item key='/data'>
//     <a style={{ textDecoration: 'none' }} href={Urls.account.my_data}>
//       {TEXT('dash:my_data', '我的数据')}
//     </a>
//   </Menu.Item>
// )

const DatasetItem = (
  <Menu.Item key='/dataset'>
    <Link style={{ textDecoration: 'none' }} to='/dataset'>
      {TEXT('dash:dataset', '数据集')}
    </Link>
  </Menu.Item>
)

const MyDataItem = (
  <Menu.Item key='/data'>
    <Link style={{ textDecoration: 'none' }} to='/data'>
      {TEXT('dash:my_data', '我的数据')}
    </Link>
  </Menu.Item>
)

// const MyTemplateItemOld = (
//   <Menu.Item key='/template'>
//     <a style={{ textDecoration: 'none' }} href={Urls.account.my_templates}>
//       {TEXT('dash:my_template', '我的模板')}
//     </a>
//   </Menu.Item>
// )

const MyTemplateItem = (
  <Menu.Item key='/template'>
    <Link style={{ textDecoration: 'none' }} to='/template'>
      {TEXT('dash:my_template', '我的模板')}
    </Link>
  </Menu.Item>
)

const AccountInfo = (
  <Menu.Item key='/account/info'>
    <Link style={{ textDecoration: 'none' }} to='/account/info'>{TEXT('OrgInfo', '组织信息')}</Link>
  </Menu.Item>
)

const invite = (
  <Menu.Item key='/invite'>
    <Link style={{ textDecoration: 'none' }} to='/invite'>{TEXT('TaskInvitation', '任务邀请')}</Link>
  </Menu.Item>
)
const inventory = (
  <Menu.Item key='/inventory'>
    <Link style={{ textDecoration: 'none' }} to='/inventory'>{TEXT('TaskList', '任务清单')}</Link>
  </Menu.Item>
)

const system_configuration = (
  <Menu.Item key='/system_configuration'>
    <Link style={{ textDecoration: 'none' }} to='/system_configuration'>{TEXT('PlatformConfig', '平台配置')}</Link>
  </Menu.Item>
)


// const CertAssign = (
//   <Menu.Item key='/cert/assign'>
//     <Link style={{ textDecoration: 'none' }} to='/cert/assign'>
//       {TEXT('dash:cert_assign', '“汇交验收”分配')}
//     </Link>
//   </Menu.Item>
// );

// const Evaluation = (
//   <Menu.Item key='/cert/evaluation'>
//     <Link style={{ textDecoration: 'none' }} to='/cert/evaluation'>{TEXT('dash:cert_evaluation', '“汇交验收”评价')}</Link>
//   </Menu.Item>
// )

const PathnameToKey = (pathname: string) => {
  return pathname;
}

const _LeftNavMenu: FC<Props> = (props) => {

  return (
    <SessionContext.Consumer>
      {value => {
        const showMyData = value.roles.includes(UserRole.DataUploader);
        const showMyTemplate = value.roles.includes(UserRole.TemplateAdmin) || value.roles.includes(UserRole.TemplateUploader);
        // 汇交验收角色
        const showCertApply = value.roles_for_acceptance.includes(AcceptanceRole.ProjectLeader) || value.roles_for_acceptance.includes(AcceptanceRole.SubjectLeader);
        const showGroupLeader = value.roles_for_acceptance.includes(AcceptanceRole.GroupLeader);
        const showAcceptanceExpert = value.roles_for_acceptance.includes(AcceptanceRole.AcceptanceExpert);
        const showCertData = showGroupLeader || showAcceptanceExpert
        return (
          <Menu
            mode="inline"
            selectedKeys={[PathnameToKey(props.location.pathname)]}
            defaultOpenKeys={['data', 'review', 'account', 'acceptance', 'certification', 'splice', 'computing', 'system']}
            style={{ height: '100%' }}
          >
            {
              showMyData || showMyTemplate ? (
                <SubMenu key="data" title={TEXT('dash:data_and_template', '数据模板管理')}>
                  {showMyData ? DatasetItem : null}
                  {showMyData ? MyDataItem : null}
                  {showMyTemplate ? MyTemplateItem : null}
                </SubMenu>
              ) : null
            }
            <SubMenu key="computing" title={TEXT('MatSwarm', '联邦计算')}>
              {invite}
              {inventory}
            </SubMenu>
            <SubMenu key="account" title={TEXT('dash:account', '账户')}>
              {AccountInfo}
            </SubMenu>
            <SubMenu key="system" title={TEXT('Platform', '平台')}>
              {system_configuration}
            </SubMenu>
          </Menu>
        )
      }}

    </SessionContext.Consumer>

  )
}

export const LeftNavMenu = withRouter(_LeftNavMenu);

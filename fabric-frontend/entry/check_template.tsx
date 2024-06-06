import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';

import { UserRole } from '../apis/define/User';
import Urls from '../apis/Urls';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { RoleCheckWrapper } from '../components/layout/RoleCheckWrapper';
import { MgeLayout } from '../components/layout/MgeLayout';
import { MenuKey } from '../components/layout/NavMenu';



import { CheckTemplate } from '../components/pages/CheckTemplate';

const forbidMessage = <FormattedMessage id='template:create_forbid' defaultMessage='你没有创建模板的权限' />;

const breadcrumbItems: BreadcrumbItem = 
    // {
    //     title: <FormattedMessage id='MGED' defaultMessage='材料基因工程专用数据库' />,
    //     url: Urls.site_index,
    // },
    // {
    //     title: <FormattedMessage id='mdb' defaultMessage='材料数据库'/>,
    //     url: Urls.search.index,
    // },
    {
        title: <FormattedMessage id='template:check' defaultMessage='查看模板' />,
    }

class CheckTemplateEntry extends Component<{}, {}> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <MgeLayout loginRequired noFooter
                titleID='check_template'
                defaultTitle='查看模板'
                selectedMenu={MenuKey.Upload}>
                <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems]} />

                <RoleCheckWrapper
                    forbidMessage={forbidMessage}
                    requiredRoles={[UserRole.TemplateUploader]}>
                    <CheckTemplate />
                </RoleCheckWrapper>

            </MgeLayout>
        );
    }
}

ReactDOM.render(<CheckTemplateEntry />, document.getElementById('wrap'));

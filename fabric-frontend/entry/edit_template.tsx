import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';

import { Button, Modal } from 'antd';
import { autobind } from 'core-decorators';

import { UserRole } from '../apis/define/User';
import Urls from '../apis/Urls';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { RoleCheckWrapper } from '../components/layout/RoleCheckWrapper';
import { MgeLayout } from '../components/layout/MgeLayout';
import { MenuKey } from '../components/layout/NavMenu';



import { EditTemplate } from '../components/pages/EditTemplate';

const forbidMessage = <FormattedMessage id='template:create_forbid' defaultMessage='你没有创建模板的权限' />;

const breadcrumbItems=(type:string): BreadcrumbItem => ({ title: type === 'edit_template' ? <FormattedMessage id='template:edit' defaultMessage='修改模板' /> : <FormattedMessage id='snippet:edit' defaultMessage='修改模板片段' /> })
interface State {
    showInstruction: boolean;
}
const url = window.location.href.split('/');
class EditTemplateEntry extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            showInstruction: false,
        };
    }
    componentDidMount() {
        // 弹框
        setTimeout(() => this.setState({ showInstruction: true }), 500);
    }
    type:string = String(url[url.length-2]);
    @autobind
    handleInstButtonClick() {
        this.setState({
            showInstruction: false,
        });
    }

    instructions() {
        return (
            <div>
                <p>
                    <FormattedMessage id='template:inst_4'
                        defaultMessage='修改模板需要遵循以下规则：' />
                </p>
                <p>
                    <FormattedMessage id='template:inst_5'
                        defaultMessage='1.不能修改字段的名称和类型' />
                </p>
                <p>
                    <FormattedMessage id='template:inst_6'
                        defaultMessage='2.不能删除字段' />
                </p>
                <p>
                    <FormattedMessage id='template:inst_7'
                        defaultMessage='3.可以添加新的字段' />
                </p>
                <p>
                    <FormattedMessage id='template:inst_8'
                        defaultMessage='4.可以修改字段的顺序' />
                </p>
            </div>

        )

    }

    render() {

        const modalFooter = [(
            <Button key='submit' type='primary' href="javascript:void(0)" onClick={this.handleInstButtonClick}>
                <FormattedMessage id='template:confirm' defaultMessage='我知道了' />
            </Button>
        )];

        return (
            <MgeLayout loginRequired noFooter
                titleID='edit_template'
                defaultTitle='修改模板'
                selectedMenu={MenuKey.Upload}>
                <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems(this.type)]} />

                <RoleCheckWrapper
                    forbidMessage={forbidMessage}
                    requiredRoles={[UserRole.TemplateUploader]}>
                    <EditTemplate />
                    <Modal
                        onOk={this.handleInstButtonClick}
                        onCancel={this.handleInstButtonClick}
                        footer={modalFooter}
                        visible={this.type==='edit_template'? this.state.showInstruction:false}
                        title={<FormattedMessage id='template:instructions' defaultMessage='模板修改须知' />}>

                        {this.instructions()}
                    </Modal>
                </RoleCheckWrapper>

            </MgeLayout>
        );
    }
}

ReactDOM.render(<EditTemplateEntry />, document.getElementById('wrap'));

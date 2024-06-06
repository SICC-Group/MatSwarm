import { Button, Modal } from 'antd';
import { autobind } from 'core-decorators';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { UserRole } from '../apis/define/User';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { MgeLayout } from '../components/layout/MgeLayout';
import { MenuKey } from '../components/layout/NavMenu';
import { RoleCheckWrapper } from '../components/layout/RoleCheckWrapper';

import { CreateTemplate } from '../components/pages/CreateTemplate';

const forbidMessage = <FormattedMessage id='template:create_forbid' defaultMessage='你没有创建模板的权限'/>;

const breadcrumbItems = (is_tem: boolean): BreadcrumbItem => ({ title: is_tem ? <FormattedMessage id='template:new' defaultMessage='创建模板' /> : <FormattedMessage id='snippet:new' defaultMessage='创建模板片段' /> })

interface State {
    showChoice: boolean; 
    showInstruction: boolean;
    is_tem: boolean;
}

class CreateTemplateEntry extends Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            showChoice: false,
            showInstruction: false,
            is_tem: true,
        };
    }

    componentDidMount() {
        // 弹框
        setTimeout(() => this.setState({showChoice: true}), 500);
    }

    @autobind
    handleInstButtonClick() {
    this.setState({
            is_tem: true,
            showInstruction: false,
        });
    }
    @autobind
    handleChoiceButtonOk(){
    this.setState({
            is_tem:true,
            showChoice:false,
        });
        setTimeout(()=>this.setState({showInstruction:true}), 500);
    }
    @autobind
    handleChoiceButtonCancel(){
    this.setState({
            is_tem:false,
            showChoice:false,
        })
    }
    render() {

        const modalFooter = [(
            <Button key='submit' type='primary' href="javascript:void(0)" onClick={this.handleInstButtonClick}>
                <FormattedMessage id='template:confirm' defaultMessage='我知道了'/>
            </Button>
        )];

        return (
            <MgeLayout loginRequired noFooter
                titleID='create_template'
                defaultTitle='创建模板'
                selectedMenu={MenuKey.Upload}>
                <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems(this.state.is_tem)]} />
                
                <RoleCheckWrapper 
                    forbidMessage={forbidMessage}
                    requiredRoles={[UserRole.TemplateUploader]}>
                    <CreateTemplate is_tem={this.state.is_tem}/>
                    <Modal
                        onOk={this.handleInstButtonClick}
                        onCancel={this.handleInstButtonClick}
                        footer={modalFooter} 
                        visible={this.state.showInstruction}
                        title={<FormattedMessage id='template:instructions' defaultMessage='模板创建须知' />}>
                        
                        <p>
                            <FormattedMessage id='template:inst_0' 
                                defaultMessage='同一条数据下的不同字段应该建立在同一个模板下，不应为每个字段创建模板'/>
                        </p>
                        <p>
                            <FormattedMessage id='template:inst_1' 
                                defaultMessage='同一条数据下的不同类型的字段也应建立在同一个模板下，无需为每个类型的字段创建模板'/>
                        </p>
                        <p>
                            <FormattedMessage id='template:inst_2' 
                                defaultMessage='为提高效率，在保证数据能够正确存储的基础上，应该使模板结构简单清晰' />
                        </p>
                        <p>
                            <FormattedMessage id='template:inst_3' 
                                defaultMessage='请勿在第一层容器建立名为id的字段！！' />
                        </p>
                        <p>
                            <FormattedMessage id='template:inst_4'
                                defaultMessage='标识符，数据特征描述字段（如材料牌号），用于模板自定义数据，必须位于第一级容器，必须是字符串类型，所有模板都必须要有！！' />
                        </p>
                        <p>
                            <FormattedMessage id='template:inst_5'
                                defaultMessage='导入的模板会忽略其标识符字段，请根据实际情况创建自己的标识符字段！' />
                        </p>
                    </Modal>
                    <Modal
                    closable={false}
                    cancelText={<FormattedMessage id='template:upload_snippet' defaultMessage='上传模板片段' /> }
                    okText={<FormattedMessage id='template:upload_template' defaultMessage='上传数据模板' />}
                    onCancel={this.handleChoiceButtonCancel}
                    onOk={this.handleChoiceButtonOk}
                    visible={this.state.showChoice}
                    title={<FormattedMessage id='template:choose_option' defaultMessage='请选择要进行的操作' />}
                    maskClosable={false}
                    keyboard={false}
                    >
                        <p><FormattedMessage id='template:choose_option' defaultMessage='请选择要进行的操作' /></p>
                        <p><FormattedMessage id='template:note_1' defaultMessage='. 上传模板片段：为方便用户创建模板，用户可自行创建模板片段，在创建数据所需模板时可嵌套使用用户自己创建的模板片段，模板片段归用户所属。'/></p>
                        <p><FormattedMessage id='template:note_2' defaultMessage='2. 上传数据模板：为数据上传一个合适格式的模板。（同原‘创建模板’）'/></p>
                    </Modal>
                </RoleCheckWrapper>
                
            </MgeLayout>
        );
    }
}

ReactDOM.render(<CreateTemplateEntry />, document.getElementById('wrap'));

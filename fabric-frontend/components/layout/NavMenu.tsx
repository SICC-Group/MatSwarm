import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import Urls from '../../apis/Urls';
import { Menu, MenuItem, SubMenuItem } from './MgeMenu';

export enum MenuKey {
    Index = 'index',
    Upload = 'upload',
    Export = 'export',
    Analytics = 'analytics',
    Help = 'help',
    Federated_computing = 'Federated computing',

}

interface NavMenuProps {
    indexOnly?: boolean;
    className?: string;
    selected?: MenuKey;
    style?: React.CSSProperties;
}

const menu = (
    <>
        {/* <SubMenuItem href={Urls.storage.add_data} >
            <FormattedMessage id='data' defaultMessage='数据'/>
        </SubMenuItem>
        <SubMenuItem href={Urls.storage.add_template} >
            <FormattedMessage id='template' defaultMessage='模板'/>
        </SubMenuItem> */}
        <SubMenuItem href={Urls.storage.upload_data} >
            <FormattedMessage id='data' defaultMessage='数据'/>
        </SubMenuItem>
        <SubMenuItem href={Urls.storage.create_template} >
            <FormattedMessage id='template' defaultMessage='模板'/>
        </SubMenuItem>
    </>
);
const exportdata = (
    <>
        <SubMenuItem href={Urls.storage.export_data} >
            <FormattedMessage id='export' defaultMessage='数据导出'/>
        </SubMenuItem>
        <SubMenuItem href='/dashboard/#/account/info' >
            <FormattedMessage id='dashboard' defaultMessage='控制面板'/>
        </SubMenuItem>
    </>
);
const analytics = (
    <>
        <SubMenuItem href={Urls.analytics.index} >
            <FormattedMessage id='analytics:category' defaultMessage='分类数据统计'/>
        </SubMenuItem>
        <SubMenuItem href={Urls.analytics.project_analytics} >
            <FormattedMessage id='analytics:project' defaultMessage='项目数据统计'/>
        </SubMenuItem>
    </>
);

function openTalking() {
    window.open('https://www.talkinggenie.com/h5/?param=C6776126512242061312','','width=600,height=800,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes')
}

const help = (
    <>
        <SubMenuItem href={Urls.site_help} >
            <FormattedMessage id='help' defaultMessage='帮助文档'/>
        </SubMenuItem>
        <SubMenuItem onClick={openTalking} >
            <FormattedMessage id='talking' defaultMessage='智能客服'/>
        </SubMenuItem>
    </>

)

const federated_computing = (
    <>
        <SubMenuItem href={Urls.federated.TaskManagement} >任务下发</SubMenuItem>
        <SubMenuItem href={Urls.federated.uploaddataset} >上传数据集</SubMenuItem>
    </>
)
export class NavMenu extends Component<NavMenuProps> {
    render() {
        return (
            <Menu className={this.props.className} style={this.props.style}>
                {/* <MenuItem href={Urls.NMDMS_site_index} selected={this.props.selected === MenuKey.Index}>
                    <span>NMDMS</span>
                </MenuItem> */}
                <MenuItem overlay={menu} selected={this.props.selected === MenuKey.Upload}>
                    <FormattedMessage id='create' defaultMessage='创建'/>
                </MenuItem>
                <MenuItem href='/dashboard/#/account/info'  selected={this.props.selected === MenuKey.Export}>
                    <FormattedMessage id='TaskMgmt' defaultMessage='控制面板'/>
                </MenuItem>
                {/* <MenuItem overlay={analytics} overlayStyle={{width:132}} selected={this.props.selected === MenuKey.Analytics}>
                    <FormattedMessage id='analytics' defaultMessage='数据统计'/>
                </MenuItem> */}
                {/*<MenuItem href={Urls.site_help} selected={this.props.selected === MenuKey.Help}>*/}
                {/*    <FormattedMessage id='help' defaultMessage='帮助'/>*/}
                {/*</MenuItem>*/}
                {/* <MenuItem overlay={federated_computing} selected={this.props.selected === MenuKey.Federated_computing}> */}
                <MenuItem href={Urls.federated.TaskManagement} selected={this.props.selected === MenuKey.Federated_computing}>
                    <FormattedMessage id='FedComp' defaultMessage='联邦计算'/>
                </MenuItem>
                <MenuItem href={Urls.site_help} selected={this.props.selected === MenuKey.Help}>
                    <FormattedMessage id='help' defaultMessage='帮助文档'/>
                </MenuItem>
            </Menu>
        );
    }
}

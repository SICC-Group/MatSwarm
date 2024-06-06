import { Button, Card, Col, message, notification , Row} from 'antd';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import {CertificateViewer} from "./CertificateViewer";
import Urls from '../apis/Urls';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { MgeLayout } from '../components/layout/MgeLayout';
import './certificate.less';
import {CertificateMobile} from './mobile/certificate';

const img = require('../img/expired.png');
const logo = require('../img/certificate_logo.png');

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
        title: <FormattedMessage id='certificate' defaultMessage='汇交证明' />,
    }

class Certificate extends Component<any, any> {

    render() {
        return(
            <MgeLayout contentStyle={{ flexDirection: 'column', display: 'flex' }}>
                <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems]} />
                <CertificateViewer/>
            </MgeLayout>
        )

    }
}

ReactDOM.render(<Certificate />, document.getElementById('wrap'));

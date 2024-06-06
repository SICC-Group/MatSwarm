import {Card, Col, Layout, Row} from 'antd';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {FormattedMessage} from 'react-intl';
import {GetCertificate} from '../../apis/certificate/Get';
import Urls from '../../apis/Urls';
import {Breadcrumb, BreadcrumbItem} from '../../components/layout/Breadcrumb';
import '../../components/layout/MgeHeader.less';
import './certificate.less';

const breadcrumbItems: BreadcrumbItem = 
    {
        title: <FormattedMessage id='certificate' defaultMessage='汇交证明'/>,
    }
const img = require('../../img/expired.png');
const logo = require('../../img/certificate_logo.png');
const logo_main = require('../../img/logo.png');
const {Header, Content, Footer} = Layout;
const styles = {
  Footer: {
    // textAlign: 'center',
    background: '#1A242F',
    color: '#FFF',
  },

  brand: {
    'fontSize': '16px',
    '& p': {
      marginBottom: '18px',
    },
    '& a': {
      color: '#00a8ff',
    },
  },

  intro: {
    'fontSize': '18px',
    '& li': {
      'display': 'inline',
      'borderRight': 'white solid',
      'borderRightWidth': '1px',
      'padding': '0 48px',

      '&:last-child': {
        borderRight: 'none',
      },

      '& a': {
        textDecoration: 'none',
        color: '#fff',
      },
    },
  },
};
let date = new Date();
let year = date.getFullYear();

export class CertificateMobile extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            dataSource: [],
            data_count: 0,
            field_count: 0,
            table_row_count: 0,
            expired: false,
            qr_code: '',
            is_project: false,
            project_info: {},
            subject_info: {},
            issue_time: '',
            fetched: false,
        };
    }

    componentDidMount(): void {
        const cert_key = String(window.location.pathname.split('/').pop());
        GetCertificate(cert_key).then((res) => {
            console.log('res from backend: ', res)
            this.setState({
                dataSource: res.categories,
                data_count: res.data_count,
                field_count: res.field_count,
                table_row_count: res.table_row_count,
                expired: res.expired,
                qr_code: res.qr_code,
                is_project: res.is_project,
                project_info: res.project,
                subject_info: (res.is_project) ? {} : res.subject,
                issue_time: res.issue_time,
                fetched: true,
            });
        });

    }

    render() {
        return (
            <Layout>
                <Header style={{display: 'flex', flexDirection: 'row'}}>
                    <a className='mge-header__title' href={Urls.site_index}>
                    <img src={logo_main} style={this.props.indexOnly ? {marginTop: '-12px', height: 68, width: 'unset'} : null}/>
                        <div className='mge-header__title__text'>
                            <div className='material'>
                                材料数据库
                            </div>
                            <div className='mged'>
                                Material Database
                            </div>
                        </div>
                    </a>
                </Header>
                <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems]} style={{padding: '0 5px'}}/>
                {
                    this.state.fetched == true ?
                        (
                             <Content>
                    <div style={{  margin: 'auto' }}>
                        <div>
                            <div>
                                <Card className='card'>
                                    <Row gutter={1}>
                                        <Col span={24}>
                                            <div className='card_head'>项目信息</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={6}>
                                            <div className='row'>项目名称</div>
                                        </Col>
                                        <Col span={18}>
                                            <div className='row'>{this.state.project_info.name}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={6}>
                                            <div className='row'>项目编号</div>
                                        </Col>
                                        <Col span={18}>
                                            <div className='row'>{this.state.project_info.id}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={6}>
                                            <div className='row'>项目负责人</div>
                                        </Col>
                                        <Col span={18}>
                                            <div className='row'>{this.state.project_info.leader}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={6}>
                                            <div className='row'>项目单位</div>
                                        </Col>
                                        <Col span={18}>
                                            <div className='row'>{this.state.project_info.ins}</div>
                                        </Col>
                                    </Row>
                                </Card>
                            </div>
                            {
                                this.state.is_project === false ? (
                                    <div style={{ flexDirection: 'column', display: 'flex' }}>
                                        <div>
                                            <Card className='card'>
                                                <Row gutter={1}>
                                                    <Col span={24}>
                                                        <div className='card_head'>课题信息</div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={6}>
                                                        <div className='row'>课题名称</div>
                                                    </Col>
                                                    <Col span={18}>
                                                        <div className='row'>{this.state.subject_info.name}</div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={6}>
                                                        <div className='row'>课题编号</div>
                                                    </Col>
                                                    <Col span={18}>
                                                        <div className='row'>{this.state.subject_info.id}</div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={6}>
                                                        <div className='row'>课题负责人</div>
                                                    </Col>
                                                    <Col span={18}>
                                                        <div className='row'>{this.state.subject_info.leader}</div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={6}>
                                                        <div className='row'>课题单位</div>
                                                    </Col>
                                                    <Col span={18}>
                                                        <div className='row'>{this.state.subject_info.ins}</div>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </div>
                                    </div>) : (<div></div>)
                            }
                        </div>
                        <div>
                        {
                            this.state.expired === true ? (
                                <div className='img'><img style={{width: '204px', marginTop: '30px' }} src={img} />
                                </div>) : null
                        }
                            <div className='card_mobile'>
                                <div className='issue_time'>统计截止至：{this.state.issue_time}</div>
                            </div>
                            <div className='table_main_mobile' style={{width: '100%', padding: '0 10px'}}>
                              <div className='table_column'>
                                  <div className='table_title' style={{height: '44px'}}>材料类别</div>
                                  <div className='table_title' style={{height: '44px'}}>模板名</div>
                                  <div className='table_title'>数据条数</div>
                                  <div className='table_title'>模板参数个数</div>
                                  <div className='table_title'>表格行数</div>
                              </div>                                
                                <div className='table_column'>
                                    <div className='table_title3' style={{height: '91px', fontSize: '14px'}}>参数说明</div>
                                    <div className='table_title3'>按照模板上传的数据条数</div>
                                    <div className='table_title3'>模板的所有数据中，有效的参数个数总和</div>
                                    <div className='table_title3'>模板的所有数据中，表格数据（工艺、性能等表格）的总行数</div>
                                </div>
                                <div className='table_column'>
                                    <div className='table_title2' style={{width: '64px', height: '91px', fontSize: '14px'}}>总计</div>
                                    <div className='table_title2'>{this.state.data_count}</div>
                                    <div className='table_title2'>{this.state.field_count}</div>
                                    <div className='table_title2'>{this.state.table_row_count}</div>

                                </div>
                                {
                                    this.state.dataSource.map((item:any) => {
                                        return (
                                            <div className='table_column' style={{marginRight:'0px'}}>
                                                <div className='table_head'>{item.category}</div>
                                                <div style={{display: "flex", flexDirection: 'row'}}>
                                                    {
                                                    item.templates.map((template:any) => {
                                                        return(
                                                            <div className='table_column'>
                                                                <div className='table_content'
                                                                     style={{height: '44px'}}
                                                                >{template.title}</div>
                                                                <div className='table_content'>{template.data_count}</div>
                                                                <div className='table_content'>{template.field_count}</div>
                                                                <div className='table_content'>{template.table_row_count}</div>

                                                            </div>
                                                        )
                                                    })
                                                }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='certificate_footer'>

                                <div style={{ textAlign: 'center' }}>
                                    <img src={logo} className='img_logo' />
                                <div className='text' style={{ textAlign: 'center' }}>国家材料数据管理与服务平台</div>
                                <div style={{ textAlign: 'center', position: 'relative' }}>
                                    {
                                        this.state.expired === true ? (<img style={{ width: '204px', zIndex: 10, position: 'absolute', marginTop: '10px' }} src={img} />) : null
                                    }
                                    <img src={'data:image/png;base64,' + this.state.qr_code} style={{ width: '204px', height: '202px', marginBottom: '10px' }} />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                </Content>
                        )
                        :
                        (
                            <div style={{ width: '95%', margin: 'auto', padding: '25px 67px' }}>
                            <h2 style={{ textAlign: 'center' }}>加载中</h2>
                        </div>
                        )
                }


                <Footer style={styles.Footer}>
                    <p> {year} <FormattedMessage id='footer:copyright' defaultMessage='版权所有'/>&copy;
                        <a href={Urls.site_index}><FormattedMessage id='MGED' defaultMessage='国家材料基因工程数据汇交与管理服务技术平台'/></a>
                    </p>
                </Footer>
            </Layout>

        );
    }
}

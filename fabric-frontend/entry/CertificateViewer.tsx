import { Button, Card, Col, message, notification , Row, Spin, Tooltip} from 'antd';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { DownloadData, GetCertificate } from '../apis/certificate/Get';
import {MgeError} from '../apis/Fetch';
import Urls from '../apis/Urls';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { MgeLayout } from '../components/layout/MgeLayout';
import './certificate.less';
import {CertificateMobile} from './mobile/certificate';
import html2canvas from 'html2canvas';
import { default as JSPDF } from 'jspdf';


const img = require('../img/expired.png');
const logo = require('../img/certificate_logo.png');
function conver(limit: any){
    // 当前后端传过来的数据单位为B
    let size = '';
    if ( limit < 0.1 * 1024 ){ // 如果小于0.1KB转化成B
        size = limit.toFixed(2) + 'B';
    }else if (limit < 0.1 * 1024 * 1024 ){// 如果小于0.1MB转化成KB
        size = (limit / 1024).toFixed(2) + 'KB';
    }else if (limit < 0.1 * 1024 * 1024 * 1024){ // 如果小于0.1GB转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
    }else{ // 其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
    }
    let sizestr = size + '';
    let len = sizestr.indexOf('\.');
    let dec = sizestr.substr(len + 1, 2);
    if (dec === '00'){// 当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
    }
    return sizestr;
}

// 用于隐藏为0的数据
function conceal(i: number | string, is_data_size = false){
    if (!is_data_size){
        return i===0 ? <div> </div> : '(' + i + ')'
    }
    else {
        return i === '0B' ? <div> </div>: '(' + i + ')'
    }
}

// 用于显示项目、课题信息
function show_info (info: any, is_project: boolean){
    let res = []
    for (let item in info){
        let obj = {
            key: '',
            value: '',
        };
        switch (item) {
            case 'name' : {obj.key = is_project ? '项目名称' : '课题名称'; obj.value=info['name'];} break;
            case 'ins' : {obj.key = is_project ?'项目单位':'课题单位'; obj.value=info['ins'];} break;
            case 'id' : {obj.key = is_project ?'项目编号':'课题编号'; obj.value=info['id'];} break;
            case 'leader': {obj.key = is_project ?'项目负责人':'课题负责人'; obj.value=info['leader'];} break;
            default: {obj.key = item; obj.value = info [item]}
        }
    res.push(obj);
    }
    return res;
}

export class CertificateViewer extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            cert_key: '',
            dataSource: [],
            research: [],
            data_count: 0,
            data_count_private: 0,
            field_count: 0,
            field_count_private: 0,
            table_count: 0,
            table_count_private: 0,
            image_count: 0,
            image_count_private: 0,
            file_count: 0,
            file_count_private: 0,
            expired: false,
            qr_code: '',
            is_project: false,
            project_info: {},
            subject_info: {},
            issue_time: '',
            fetched: false,
            is_PC: true,
            data_size: 0,
            data_size_private: 0,
            getPDF: false,  // 导出pdf的状态，true为正在导出
            percent: 0, // 导出进度，100完成
        };
    }
    componentDidMount(): void {
        const device = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
        let cert_key = '';
        if (this.props.cert_key == null){
            // cert_key = window.location.search.split('?')[1].split('cert_key=')[1];
            cert_key = String(window.location.pathname.split('/').pop());
        }
       else {
           cert_key = this.props.cert_key;
        }
        this.setState({
            is_PC: device == null,
            cert_key,
        });
        GetCertificate(cert_key).then((res) => {
            this.setState({
                dataSource: res.categories,
                research: res.research,
                research_private: res.research_private,
                data_count: res.data_count,
                data_count_private: res.data_count_private,
                field_count: res.field_count,
                field_count_private: res.field_count_private,
                table_count: res.table_count,
                table_count_private: res.table_count_private,

                expired: res.expired,
                qr_code: res.qr_code,
                is_project: res.is_project,
                project_info: res.project,
                subject_info: (res.is_project) ? {} : res.subject,
                issue_time: res.issue_time,

                data_size: res.data_size,
                data_size_private: res.data_size_private,
                image_count: res.image_count,
                image_count_private: res.image_count_private,
                file_count: res.file_count,
                file_count_private: res.file_count_private,
                fetched: true,
            });
        });
    }

    handleExport = () => {
        // 新的汇交证明导出
        window.open(window.location.pathname + '/pdf');
    };

    handleDownload = (tid: any, random: number) => {
        console.log('test', tid, random, this.state.cert_key);
        DownloadData(this.state.cert_key, tid, random).then( (res) => {
            notification.success({
                message: '下载任务已添加，可前往任务页面查看',
            });
        }).catch( (res: MgeError) => {
            notification.error({
                message: res.message,
            });
        });
    }

    render() {
        if (this.state.is_PC) {
            return (
                this.state.fetched ? (
                    <div>
                        {/* 只有为汇交证明查看模式时才显示下载报告按钮， 验收页面不显示，   当失效时不显示this.state.expired === true*/}
                        {
                            <div style={{  margin: ' 0 0 10px 100px', display:((this.props.cert_key == null && this.state.expired === false) ? 'block' : 'none') }}>
                                <Button type='primary' style={{ textAlign: 'center' }} id='submitButton' onClick={this.handleExport}>下载证明</Button>
                            </div>
                        }
                        <div style={{ width: '1300px', margin: 'auto', padding: '20px 0px' }}>
                            <div>
                                <div style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>

                                    {/* 下载报告用的标签：项目信息 */}
                                    <div style={{ width: '80%', margin: 'auto' }}>
                                        
                                            <Card className='card'>
                                                <form name='VerificationReport1'>
                                                <Row gutter={1}>
                                                    <Col span={24}>
                                                        <div className='card_head'>项目信息</div>
                                                    </Col>
                                                </Row>
                                                {
                                                    show_info(this.state.project_info, true).map(item => {
                                                        return (
                                                            // <form name='VerificationReport1'>
                                                            <Row gutter={[8, 16]} type='flex' style={{ borderBottom: '3px solid #f0f2f5' }} >
                                                                <Col span={15} className='row' style={{ borderRight: '3px solid #f0f2f5' }}>{item.key}</Col>
                                                                <Col span={8} className='row' >{item.value}</Col>
                                                            </Row>
                                                            // </form>
                                                        )
                                                    })
                                                }
                                                </form>
                                            </Card>
                                    </div>

                                    {/* 下载报告用的标签：课题信息 */}

                                    {this.state.is_project == false ? (
                                        <div style={{ width: '80%', margin: 'auto' }}>
                                            {/* <form name='VerificationReport1'> */}
                                                <Card className='card'>
                                                    <form name='VerificationReport1'>
                                                    <Row gutter={1}>
                                                        <Col span={24}>
                                                            <div className='card_head'>课题信息</div>
                                                        </Col>
                                                    </Row>
                                                    {/* </form> */}
                                                    {
                                                        show_info(this.state.subject_info, false).map(item => {
                                                            return (
                                                                // <form name='VerificationReport1'>
                                                                <Row type='flex' gutter={[8, 16]} style={{ borderBottom: '3px solid #f0f2f5' }}>
                                                                    <Col span={15} className='row' style={{ borderRight: '3px solid #f0f2f5' }}>{item.key}</Col>
                                                                    <Col span={8} className='row' >{item.value}</Col>
                                                                </Row>
                                                                // </form>
                                                            )
                                                        })
                                                    }
                                                    </form>
                                                </Card>                                           
                                        </div>
                                        ) : (
                                                <div></div>
                                            )}

                                </div>
                            </div>

                            <div>
                                {/* 下载报告用的标签： 统计截止、表格1 */}
                                <form name='VerificationReport1'>
                                    {
                                        this.state.expired === true ? (
                                            <div className='img'><img style={{ width: '30%', marginTop: '30px' }} src={img} />
                                            </div>) : null
                                    }
                                    <div className='card' style={{ background: 'white' }}>
                                        <div className='issue_time' style={{marginTop: '10px'}}>统计截止至：{this.state.issue_time}</div>
                                        <div className='issue_time'>注：括号内为对应项目下未公开数据统计值</div>
                                        <div className='table_row'>
                                            <div className='table' style={{ borderRadius: '8px 0 0 0', width: '10%' }}>材料类别</div>
                                            <div className='table'>模板名称</div>
                                            <div className='table'>数据条数</div>
                                            <div className='table'>数据大小</div>
                                            <div className='table'>模板参数个数</div>
                                            <div className='table'>表格总数量</div>
                                            <div className='table'>图片总数量</div>
                                            <div className='table'>文件总数量</div>
                                            <div className='table'>数据原始文件下载</div>
                                            <div className='table' style={{ borderRadius: '0 8px 0 0' }}>数据抽查文件下载</div>
                                        </div>
                                    </div>
                                    <div className='card'>
                                        <div className='table_row'>
                                            <div className='header_left'>参数说明</div>
                                            <div className='table_main'>
                                                <div className='content_blank' />
                                                <div style={{ width: '4px', background: 'white' }} />
                                                <div className='header_content'>按照模板上传的数据条数</div>
                                                <div className='header_content'>数据大小</div>
                                                <div className='header_content'>模板的所有数据中，有效的参数个数总和</div>
                                                <div className='header_content'>表格总数量</div>
                                                <div className='header_content'>图片总数量</div>
                                                <div className='header_content'>附件总数量</div>
                                                <div className='header_content'>下载对应模板下的所有数据（不包括图片和附件）</div>
                                                <div className='header_content'>随机抽取十分之一的数据进行下载（包括所有图片和附件）</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card'>
                                        <div className='table_row'>
                                            <div className='header_left'>总计</div>
                                            <div className='table_main'>
                                                <div className='content_blank' />
                                                <div style={{ width: '4px', background: 'white' }} />
                                                <div className='header_content'>{this.state.data_count}{conceal(this.state.data_count_private)}</div>
                                                <div className='header_content'>{conver(this.state.data_size)}{conceal(conver(this.state.data_size_private), true)}</div>
                                                <div className='header_content'>{this.state.field_count}{conceal(this.state.field_count_private)}</div>
                                                <div className='header_content'>{this.state.table_count}{conceal(this.state.table_count_private)}</div>
                                                <div className='header_content'>{this.state.image_count}{conceal(this.state.image_count_private)}</div>
                                                <div className='header_content'>{this.state.file_count}{conceal(this.state.file_count_private)}</div>
                                                <div className='header_content'> </div>
                                                <div className='header_content'> </div>
                                            </div>

                                        </div>
                                    </div>
                                </form>
                                    {
                                        this.state.dataSource.map((item: any) => {
                                            return (
                                                <form name='VerificationReport1'>
                                                <div className='card' style={{ marginTop: '4px' }}>
                                                    <div className='table_row'>
                                                        <div className='content_left'>{item.category}</div>
                                                        <div style={{ width: '90%' }}>
                                                            {
                                                                item.templates.map((template: any) => {
                                                                    return (
                                                                        <div className='table_row' style={{ marginBottom: '4px' }}>
                                                                            <div className='content'>{template.title}</div>
                                                                            <div className='content'>{template.data_count}{conceal(template.data_count_private)}</div>
                                                                            <div className='content'>{conver(template.data_size)}{conceal(conver(template.data_size_private), true)}</div>
                                                                            <div className='content'>{template.field_count}{conceal(template.field_count_private)}</div>
                                                                            <div className='content'>{template.table_count}{conceal(template.table_count_private)}</div>
                                                                            <div className='content'>{template.image_count}{conceal(template.image_count_private)}</div>
                                                                            <div className='content'>{template.file_count}{conceal(template.file_count_private)}</div>
                                                                            <a className='content' onClick={() => { this.handleDownload(template.tid, 0); }}>点击下载</a>
                                                                            <a className='content' onClick={() => { this.handleDownload(template.tid, 1); }}>点击下载</a>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                </form>
                                            );
                                        })
                                    }
                                

                                {/* 下载报告用的标签： 表格2 */}
                                <form name='VerificationReport1'>
                                    <div className='card' style={this.state.research.length > 0 ? { background: 'white' } : { display: 'none', background: 'white' }}>
                                        <div className='table_row'>
                                            <div className='table' style={{ borderRadius: '8px 0 0 0', width: '40%', fontSize: '20px' }}>科研成果名称</div>
                                            <div className='table' style={{ width: '20%', fontSize: '20px' }}>平台提交数量</div>
                                            <div className='table' style={{ width: '20%', fontSize: '20px' }}>所有文件下载</div>
                                            <div className='table' style={{ borderRadius: '0 8px 0 0', width: '20%', fontSize: '20px' }}>抽查文件下载</div>
                                        </div>
                                    </div>
                                    {
                                        this.state.research.map((item: any, index: any) => {
                                            if (item.count !== 0) {
                                                return (
                                                    <div className='table_row' style={{ marginBottom: '4px' }}>
                                                        <div className='content' style={{ width: '40%' }}>{item.name}</div>
                                                        <div className='content' style={{width: '20%'}}>{item.count}{conceal(this.state.research_private[index].count)}</div>
                                                        <div className='content' style={{ width: '20%' }}><a onClick={() => { this.handleDownload(item.tid, 0); }}>下载</a></div>
                                                        <div className='content' style={{ width: '20%' }}><a onClick={() => { this.handleDownload(item.tid, 0); }}>下载</a></div>
                                                    </div>
                                                );
                                            }
                                        })
                                    }
                                </form>

                                {/* 下载报告用的标签： 底部logo、二维码 */}
                                <form name={this.props.cert_key === undefined ? 'VerificationReport1' : 'display_none'}>
                                    <div className='certificate_footer' style={this.props.cert_key === undefined ? {} : { display: 'none' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <img src={logo} className='img_logo' />
                                            <div className='text' style={{ textAlign: 'center' }}>国家材料数据管理与服务平台</div>
                                            <div style={{ textAlign: 'center', position: 'relative' }}>
                                                {
                                                    this.state.expired === true ? (<img style={{ width: '25%', zIndex: 10, position: 'absolute' }} src={img} />) : null
                                                }
                                                <img src={'data:image/png;base64,' + this.state.qr_code} style={{ width: '20%' }} />

                                            </div>
                                            <span className='issue_time'>最新证明文件可扫描二维码查看</span>
                                        </div>
                                    </div>
                                </form>
                                
                            </div>
                        </div>
                    </div>) : (
                        <div>
                            <div style={{ width: '95%', margin: 'auto', padding: '25px 67px' }}>
                                <h2 style={{ textAlign: 'center' }}>加载中</h2>
                            </div>
                        </div>
                    )

            );
        }
        else {
            return (
                <CertificateMobile />
            );
        }

    }
}

// ReactDOM.render(<CertificateViewer />, document.getElementById('wrap'));

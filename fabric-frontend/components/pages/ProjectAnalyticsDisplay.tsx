import React, {Component, useState} from 'react';
import { FormattedMessage } from 'react-intl';

import { Col, Row, Card, Spin, Table } from 'antd';
import { autobind } from 'core-decorators';

import { Encode } from '../../utils/Base64';
import { GetProjectAnalytics, Related } from '../../apis/project/ProjectAnalytics';
import { CategoryData, GetGlobalAnalytics, TrendData, Acceptance} from '../../apis/analytics/Get';
import { ProjectAnalytisOverview, ProjectInfo } from '../../apis/project/AnalyticsOverview';
import { GraphType, MgeCarousel, ShowType } from '../analytics/MgeCarousel';
import { DataCard } from '../analytics/DataCard';
import { TitledCard } from '../analytics/TitledCard';
import Urls from '../../apis/Urls';

import dataIcon from '../../img/analytics_data.png';
import templateIcon from '../../img/analytics_template.png';
import acceptedIcon from '../../img/accepted.png';
import unacceptedIcon from '../../img/unaccepted.png';
import { TEXT } from '../../locale/Text';
import { Info } from '../../apis/session/Info';
import { AcceptanceRole } from '../../apis/define/User';
import {CreateFullTextQuery, Query} from "../../apis/search/v2/Query";
import {LoadingModal} from "../common/LoadingModal";

export interface AnalyticsDisplayProps {
    global: boolean;
    name: string | JSX.Element;
    id: string;
}

interface State {
    overview: ProjectInfo[];
    loading: boolean;
    viewCount: number;
    downloadCount: number;
    dataCount: number;
    templateCount: number;
    categoryData: CategoryData[];
    trendData: TrendData[];
    relatedCategory: Related[];
    relatedTemplate: Related[];
    table: boolean;
    isLeader: boolean;
    acceptance:Acceptance; //项目验收情况
    ac_status:string;//项目验收状态
    uploadTime:any;//开始汇交项目统计
    applyCount:any;//开始验收项目统计
    distribution:any;//汇交条数项目统计
    searchLoading:boolean;
}

const { Column } = Table;

export class ProjectAnalyticsDisplay extends Component<AnalyticsDisplayProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            overview: [],
            loading: true,
            viewCount: 0,
            downloadCount: 0,
            dataCount: 0,
            templateCount: 0,
            categoryData: [],
            trendData: [],
            relatedCategory: [],
            relatedTemplate: [],
            table: true,
            isLeader: false,
            acceptance:{2016:[],2017:[],2018:[],total:[]},
            ac_status:'',
            uploadTime:{},
            applyCount:{},
            distribution:{},
            searchLoading:false,
        };
    }

    componentDidMount() {
        this.setState({ table: true });
        this.fetchData(this.props.id, this.props.global);
        ProjectAnalytisOverview().then(value => {
            this.setState({ overview: value, table: false });
        });
        Info().then((value) => {
            if (value.roles_for_acceptance.includes(AcceptanceRole.GroupLeader)) {
                this.setState({ isLeader: true });
            }
        });
    }

    getAnalytics(id: string, end_time: number) {
        const isSubject = Number(id[id.length - 1]) | Number(id[id.length - 2]);
        if (isSubject) {
            var subject_id = id.slice(0, id.length - 2) + "00";
            GetProjectAnalytics(subject_id, end_time, end_time - 100, id).then((value) => {
                if (this.props.id === value.id){
                    this.setState({
                        loading: false,
                        dataCount: value.data_count,
                        templateCount: value.template_count,
                        categoryData: value.categories,
                        trendData: value.trend,
                        relatedCategory: value.categories,
                        relatedTemplate: value.templates,
                        ac_status: value.ac_status //课题验收状态 与项目一致
                    });
                }
            })
        } else {
            GetProjectAnalytics(id, end_time, end_time - 100).then((value) => {
                if(this.props.id === value.id) {
                    this.setState({
                        loading: false,
                        dataCount: value.data_count,
                        templateCount: value.template_count,
                        categoryData: value.categories,
                        trendData: value.trend,
                        relatedCategory: value.categories,
                        relatedTemplate: value.templates,
                        ac_status:value.ac_status, //项目验收状态
                    });
                }

            })
        }
    }
    @autobind
    fetchData(id: string, global?: boolean) {
        var d = new Date();
        var end_time = d.getFullYear() * 100 + d.getMonth() + 1;
        this.setState({
            loading: true,
            viewCount: 0,
            downloadCount: 0,
            dataCount: 0,
            templateCount: 0,
            categoryData: [],
            trendData: [],
            relatedCategory: [],
            relatedTemplate: [],
        });

        (global ? GetGlobalAnalytics().then((value) => {
            if(this.props.id === 'all'){
                this.setState({
                loading: false,
                viewCount: value.global.view,
                downloadCount: value.global.download,
                dataCount: value.global.data,
                templateCount: value.global.template,
                categoryData: value.class,
                trendData: value.trend,
                acceptance:value.acceptance,
                uploadTime:value.uploadtime,
                distribution:value.distribution,
                applyCount:value.applycount
                });
            }

        })
            : this.getAnalytics(id, end_time)
        );
    }

    componentWillReceiveProps(nextProps: AnalyticsDisplayProps) {
        if (this.props.id != nextProps.id) {
            this.fetchData(nextProps.id, nextProps.global);
        }
    }

    onItemClick(key: number) {
        const q = {
            meta: {
                field: 'category_id',
                op: 'eq',
                val: Number(key),
            },
            page: 0,
        };
        const qStr = JSON.stringify(q);

        window.open(Urls.search.index + `?q=${Encode(qStr)}`);
    }

    onSearchClick(text: string) {
        this.setState({
            searchLoading:true,
        })
        CreateFullTextQuery(text).then(this.handleResult)
    }

    handleResult = (result: Query) => {
        this.setState({
            searchLoading:false,
        })
        window.open('/search/#/'+result.id)
  }

    ItemToDiv(item: Related, onItemClick?: (key: number) => void) {
        return (
            <div key={item.id} style={{ display: "flex", width: "100%", padding: "8px 20px", color: "#8B8B8B", cursor: "pointer" }} onClick={() => onItemClick(item.id)}>
                <div style={{ fontSize: "12px", lineHeight: "16px" }}>
                    {item.name}
                </div>
            </div>
        );
    }

    render() {
        let infoRow: JSX.Element = null;
        let graphRow: JSX.Element = null;
        let relatedRow: JSX.Element = null;
        let overview: JSX.Element = null;
        const msg:string = this.state.ac_status === '通过'?'验收通过':this.state.ac_status;
        infoRow = (
            <Row type='flex'>
                <Col xs={24} sm={12}>
                    <Card style={{ margin: '6px 8px' }} bordered={false}>
                        <div className='DataCard__content__title'>{TEXT("dash:ps_name", "项目/课题名称")}</div>
                        <a style={{ fontSize: 'x-large', fontWeight: 500 }} onClick={()=>{
                                        this.onSearchClick(this.props.id)}}>{this.props.name}({msg})</a>
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card style={{ position: 'absolute', left: '8px', right: '8px', top: '6px', bottom: '6px' }} bordered={false}>
                        <div className='DataCard__content__title'>{TEXT("dash:ps_id", "项目/课题编号")}</div>
                        <a style={{ fontSize: 'x-large', fontWeight: 500 }} onClick={()=>{
                                        this.onSearchClick(this.props.id)}}>{this.props.id}</a>
                    </Card>
                </Col>
            </Row >
        )

        graphRow = (
            <div>
            <Row>
                <Col xs={24} lg={12}>
                    <TitledCard
                        title={<FormattedMessage id='analytics:trend_graph' defaultMessage='趋势图' />}>
                        <MgeCarousel trendData={this.state.trendData} categoryData={this.state.categoryData}
                            loading={this.state.loading} graphType={GraphType.Trend} showType={ShowType.DataTemplate} />
                    </TitledCard>
                </Col>
                <Col xs={24} lg={12}>
                {this.props.global ? //全站统计页面显示趋势图
                    <TitledCard
                        title={<FormattedMessage id='analytics:trend_graph' defaultMessage='趋势图' />}>
                        <MgeCarousel trendData={this.state.trendData} categoryData={this.state.categoryData}
                            loading={this.state.loading} graphType={GraphType.Trend} showType={ShowType.ViewDownload} />
                    </TitledCard>
                    : //单个项目或课题页面显示模板相关分类统计图
                    <TitledCard
                            title={<FormattedMessage id='analytics:statistics' defaultMessage='统计'/>}>
                            <MgeCarousel trendData={this.state.trendData} categoryData={this.state.categoryData} 
                                loading={this.state.loading} graphType={GraphType.Statistics} showType={ShowType.All}/>
                    </TitledCard>
                }
                </Col>
            </Row>
            {this.props.global?
            <div>
            <Row>
                <Col xs={24} md={12} lg={6}>
                    <TitledCard
                        title={<FormattedMessage id='analytics:2016 Project Acceptance Chart' defaultMessage='16年立项项目验收情况' />}>
                        <MgeCarousel trendData={this.state.trendData} categoryData={this.state.categoryData} PieData={this.state.acceptance[2016]}
                            loading={this.state.loading} graphType={GraphType.Pie} showType={ShowType.All} />
                    </TitledCard>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <TitledCard
                        title={<FormattedMessage id='analytics:2017 Project Acceptance Chart' defaultMessage='17年立项项目验收情况' />}>
                        <MgeCarousel trendData={this.state.trendData} categoryData={this.state.categoryData} PieData={this.state.acceptance[2017]}
                            loading={this.state.loading} graphType={GraphType.Pie} showType={ShowType.All} />
                    </TitledCard>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <TitledCard
                        title={<FormattedMessage id='analytics:2018 Project Acceptance Chart' defaultMessage='18年立项项目验收情况' />}>
                        <MgeCarousel trendData={this.state.trendData} categoryData={this.state.categoryData} PieData={this.state.acceptance[2018]}
                            loading={this.state.loading} graphType={GraphType.Pie} showType={ShowType.All} />
                    </TitledCard>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <TitledCard
                        title={<FormattedMessage id='analytics:All Project Acceptance Chart' defaultMessage='所有项目验收情况' />}>
                        <MgeCarousel trendData={this.state.trendData} categoryData={this.state.categoryData} PieData={this.state.acceptance['total']}
                            loading={this.state.loading} graphType={GraphType.Pie} showType={ShowType.All} />
                    </TitledCard>
                </Col>
            </Row>
            <Row>
                <Col xs={24} lg={8}>
                    <TitledCard
                        title={<FormattedMessage id='analytics:Quantity statistics of remittance items' defaultMessage='开始汇交项目数量统计' />}> 
                        <MgeCarousel trendData={this.state.trendData} categoryData={this.state.categoryData} ProjectData={this.state.uploadTime}
                            loading={this.state.loading} graphType={GraphType.Statistics} showType={ShowType.Project} showXUnit={true} showUnit={false}/>
                    </TitledCard>
                </Col>
                <Col xs={24} lg={8}>
                    <TitledCard
                        title={<FormattedMessage id='analytics:Quantity statistics of acceptance items' defaultMessage='开始验收项目数量统计' />}>
                        <MgeCarousel trendData={this.state.trendData} categoryData={this.state.categoryData} ProjectData={this.state.applyCount}
                            loading={this.state.loading} graphType={GraphType.Statistics} showType={ShowType.Project} showXUnit={true} showUnit={false}/>
                    </TitledCard>
                </Col>
                <Col xs={24} lg={8}>
                    <TitledCard
                        title={<FormattedMessage id='analytics:Quantity statistics of remittance data' defaultMessage='项目汇交数据分布统计' />}>
                        <MgeCarousel trendData={this.state.trendData} categoryData={this.state.categoryData} ProjectData={this.state.distribution}
                            loading={this.state.loading} graphType={GraphType.Statistics} showType={ShowType.Project} showXUnit={false} showUnit={true}/>
                    </TitledCard>
                </Col>
            </Row>
            </div>:null}
            </div>
        );

        relatedRow = (
            <Row>
                <Col xs={24} xl={12}>
                    <TitledCard title={<FormattedMessage id='template' defaultMessage='相关模板' />}>
                        <div style={{ padding: "8px 0px", minHeight: "208px",maxHeight:'208px', display: "flex", flexDirection: "column",overflowY: 'scroll' }}>
                            {this.state.loading ?
                                (<div style={{ display: "flex", width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: "1" }}>
                                    <Spin />
                                </div>)
                                : this.state.relatedTemplate.map((value) => this.ItemToDiv(value, this.onItemClick))}
                        </div>
                    </TitledCard>
                </Col>
                <Col xs={24} xl={12}>
                    <TitledCard title={<FormattedMessage id='category' defaultMessage='相关分类' />}>
                        <div style={{ padding: "8px 0px", minHeight: "208px",maxHeight:'208px', display: "flex", flexDirection: "column", overflowY: 'scroll'}}>
                            {this.state.loading ?
                                (<div style={{ display: "flex", width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: "1" }}>
                                    <Spin />
                                </div>)
                                : this.state.relatedCategory.map((value) => this.ItemToDiv(value, this.onItemClick))}
                        </div>
                    </TitledCard>
                </Col>
            </Row >
        );

        overview = this.state.isLeader ? (
            <TitledCard title={<FormattedMessage id='analytics:global' defaultMessage='全局统计' />}>
                <div style={{ padding: "8px 0px", minHeight: "200px", display: "flex", flexDirection: "column" }}>
                    {this.state.loading ?
                        (<div style={{ display: "flex", width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: "1" }}>
                            <Spin />
                        </div>)
                        : (
                            <Table dataSource={this.state.overview} loading={this.state.table} rowKey={record => record.id} pagination={{ pageSize: 15 }}>
                                <Column title={TEXT('project_id', '项目编号')} key='id' dataIndex='id' width='20%' render={(text) => {
                                    return (<a onClick={()=>{
                                        this.onSearchClick(text)
                                    }
                                    }>{text}</a>);
                                }}/>
                                <Column title={TEXT('name', '项目名称')} key='name' dataIndex='name' width='35%' render={(text: string, record: ProjectInfo) => {
                                    return (<a onClick={()=>{
                                        this.onSearchClick(record.id)
                                    }
                                    }>{text}</a>);
                                }}/>
                                <Column title={TEXT('leader', '项目负责人')} key='leader' dataIndex='leader' width='10%' />
                                <Column title={TEXT('analytics:data_count', '汇交条数')} key='data_count' dataIndex='data_count' width='10%' />
                                <Column title={TEXT('analytics:template_count', '汇交模板数')} key='tem_count' dataIndex='tem_count' width='10%' />
                                {/* <Column title={'课题数据量完成度'} key='quota_data_count' dataIndex='quota_data_count' width='15%' render={(text)=>{
                                    return(
                                    <div>{text === 0 ? TEXT('应提交数据量未知') : text}</div>
                                    )
                                }}/>  */}
                            </Table>
                        )}
                </div>
            </TitledCard>
        ) : null;

        return (
            <div style={{ display: 'flex', width: '100%', padding: '6px 34px', flexDirection: 'column' }}>
                <LoadingModal loading={this.state.searchLoading} />
                {this.props.global?
                 <Row>
                    <Col xs={24} xl={12}>
                        <DataCard icon={acceptedIcon}
                            value={this.state.acceptance.total[0]}
                            loading={this.state.loading}
                            title={<FormattedMessage id='analytics:accepted_items' defaultMessage='已验收项目数' />}
                            />
                    </Col>
                    <Col xs={24} xl={12}>
                        <DataCard icon={unacceptedIcon}
                            value={this.state.acceptance.total[1]}
                            loading={this.state.loading}
                            title={<FormattedMessage id='analytics:items to be accepted' defaultMessage='未验收项目数' />}
                            />
                    </Col>
                 </Row>:infoRow}
                <Row>
                    <Col xs={24} xl={12}>
                        <DataCard icon={dataIcon}
                            value={this.state.dataCount}
                            loading={this.state.loading}
                            title={<FormattedMessage id='analytics:data_count' defaultMessage='数据总量' />}
                            // unit={<FormattedMessage id='analytics:unit_ge' defaultMessage='单位/条' />} />
                            unit={<FormattedMessage id='analytics:unit_ge' defaultMessage='条' />} />
                    </Col>
                    <Col xs={24} xl={12}>
                        <DataCard icon={templateIcon}
                            value={this.state.templateCount}
                            loading={this.state.loading}
                            title={<FormattedMessage id='analytics:template_count' defaultMessage='模板总数' />}
                            // unit={<FormattedMessage id='analytics:unit_ge' defaultMessage='单位/个' />} />
                            unit={<FormattedMessage id='analytics:unit_ge' defaultMessage='个' />} />
                    </Col>
                </Row>
                {graphRow}
                {this.props.global ? overview : relatedRow}
            </div>
        );
    }
}

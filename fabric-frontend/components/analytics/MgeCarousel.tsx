import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Spin } from 'antd';
import { autobind } from 'core-decorators';
import { Bar, Line ,Pie } from 'react-chartjs-2';

import { CategoryData, TrendData  } from '../../apis/analytics/Get';
import arrowLeft from '../../img/analytics_arrow_left.png';
import arrowRight from '../../img/analytics_arrow_right.png';
import { TEXT } from '../../locale/Text';
import './MgeCarousel.less';
import Cookies from 'js-cookie';

export enum GraphType {
    Statistics, Trend, Pie
}

export enum DataType {
    View = 'view', 
    Download = 'download', 
    Data = 'data', 
    Template = 'template',
}

export enum ShowType {
    All, DataTemplate, ViewDownload,Project
}

export interface MgeCarouselProps {
    className?: string;
    style?: React.CSSProperties;

    showType: ShowType;
    graphType: GraphType;
    trendData: TrendData[];
    categoryData: CategoryData[];
    PieData?:number[];
    ProjectData?:[];
    loading?: boolean;
    showUnit?:boolean;
    showXUnit?:boolean;
}

interface State {
    dataType: DataType;
}

const view = <FormattedMessage id='analytics:view' defaultMessage='查看量'/>;
const downlaod = <FormattedMessage id='analytics:download' defaultMessage='下载量'/>;
const dataCount = <FormattedMessage id='analytics:data_count' defaultMessage='数据量'/>;
const templateCount = <FormattedMessage id='analytics:template_count' defaultMessage='模板量'/>;

const trend = <FormattedMessage id='analytics:trend_graph' defaultMessage='趋势图'/>;
const stat = <FormattedMessage id='analytics:statistics' defaultMessage='统计图' />;
const pielabel = Cookies.get('django_language') === 'en-US'?['Accepted','Unaccepted']:['已验收','未验收'];
const barYlabel = Cookies.get('django_language') === 'en-US'?'Project Number':'项目数量';
const barXlabel = Cookies.get('django_language') === 'en-US'?'Start Time':'开始时间';
const barXlabel1 = Cookies.get('django_language') === 'en-US'?'Remittance Data Number':'汇交数据条数';
function DataTypeToMessage(dataType: DataType): JSX.Element {
    switch (dataType) {
        case DataType.View: return view;
        case DataType.Download: return downlaod;
        case DataType.Data: return dataCount;
        case DataType.Template: return templateCount;
    }
}

function BarDataset(categoryData: CategoryData[], projectData:any, dataType: DataType,showType:ShowType) {
    let labels: string[] = [];
    let data: number[] = [];
    if(showType === ShowType.Project){ //渲染项目统计相关柱状图
        for(var key in projectData){
            labels.push(key);
            data.push(projectData[key])
        }
    }
    else{
    categoryData.forEach((value) => {
        let num = 0;
        switch (dataType) {
            case DataType.Data: num = value.counts.data; break;
            case DataType.Download: num = value.counts.download; break;
            case DataType.Template: num = value.counts.template; break;
            case DataType.View: num = value.counts.view; break;
        }
        if (num !== 0) {
            labels.push(value.name);
            data.push(num);
        }
    })};

    // if (labels.length === 0 || labels.length < 5) {
    //     labels = categoryData.map((value) => value.name);
    //     data = categoryData.map((value) => {
    //         switch (dataType) {
    //             case DataType.Data: return value.counts.data;
    //             case DataType.Download: return value.counts.download;
    //             case DataType.Template: return value.counts.template;
    //             case DataType.View: return value.counts.view;
    //         }
    //     });
    // }
    return {
        labels,
        datasets: [
            {
                backgroundColor: '#FFB24D',
                // borderColor: 'rgba(255,99,132,1)',
                borderWidth: 0,
                hoverBackgroundColor: '#A65107',
                // hoverBorderColor: 'rgba(255,99,132,1)',
                data,
            },
        ],
        
    };
}

function LineDataset(trendData: TrendData[], dataType: DataType) {

    const data = trendData.map((value) => {
        switch (dataType) {
            case DataType.Data: return value.counts.data;
            case DataType.Download: return value.counts.download;
            case DataType.Template: return value.counts.template;
            case DataType.View: return value.counts.view;
        }
    });

    return {
        labels: trendData.map((value) => `${value.year}/${value.month}`),
        datasets: [
            {
                data,
                borderColor: '#5AA6C7',
                backgroundColor: 'rgba(90,166,199,0.20)',
            },
        ],
    };
}

function PieDataset(pieData:number[]) {
 return{
    labels: pielabel,
    datasets: [
        {
            data:pieData,
            //borderColor: '#5AA6C7',
            backgroundColor: ["#36a2eb",'#FFB24D',]
        }
        ],
 }
}

const typeAll = [DataType.Data, DataType.Template, DataType.View, DataType.Download];
const typeViewDownload = [DataType.View, DataType.Download];
const typeDataTemplate = [DataType.Data, DataType.Template];

export class MgeCarousel extends Component<MgeCarouselProps, State> {
    
    constructor(props: any) {
        super(props);
        this.state = {
            dataType: (this.props.showType === ShowType.ViewDownload ? DataType.View : DataType.Data),
        };
    }

    componentWillReceiveProps(nextProps: MgeCarouselProps) {
        this.setState({
            dataType: (nextProps.showType === ShowType.ViewDownload ? DataType.View : DataType.Data),
        });
    }

    @autobind
    switchTo(dataType: DataType) {
        this.setState({
            dataType,
        });
    }

    @autobind
    switchNext() {
        const mapArray = (this.props.showType === ShowType.All ? typeAll : (this.props.showType === ShowType.DataTemplate ? typeDataTemplate : typeViewDownload));
        let index = mapArray.indexOf(this.state.dataType) + 1;
        if (index > mapArray.length - 1) {
            index = 0;
        }
        this.setState({
            dataType: mapArray[index],
        });
    }

    @autobind
    switchPrev() {
        const mapArray = (this.props.showType === ShowType.All ? typeAll : (this.props.showType === ShowType.DataTemplate ? typeDataTemplate : typeViewDownload));
        let index = mapArray.indexOf(this.state.dataType) - 1;
        if (index < 0) {
            index = mapArray.length - 1;
        }
        this.setState({
            dataType: mapArray[index],
        });
    }

    render() {
        const className = 'MgeCarousel ' + (this.props.className || '');

        if (this.props.loading) {
            return (
                <div className={className} style={this.props.style}>
                    <div className='MgeCarousel__spin'>
                        <Spin/>
                    </div>
                </div>
            );
        }

        // dots
        const mapArray = (this.props.showType === ShowType.All ? typeAll : (this.props.showType === ShowType.DataTemplate ? typeDataTemplate : typeViewDownload));
        const dots = (
            <div className='MgeCarousel__dots'>
                {mapArray.map((value) => (
                    <div key={value} onClick={() => this.switchTo(value)} 
                        className={`MgeCarousel__dots__dot ${value === this.state.dataType ? 'selected' : ''}`} />
                ))}
            </div>
        );
        let graph: JSX.Element = null;
        if (this.props.graphType === GraphType.Statistics) {
            const data = BarDataset(this.props.categoryData, this.props.ProjectData,this.state.dataType,this.props.showType);
            const options = {
                legend: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        ticks: {
                        autoSkip: false,
                        },
                        scaleLabel:{
                            display: true,
                            labelString: this.props.showType === ShowType.Project?(this.props.showXUnit?barXlabel:barXlabel1) :''
                        }
                    }],
                    yAxes: [{
                        ticks:{
                            min:0
                        },
                        scaleLabel:{
                            display: this.props.showType === ShowType.Project?true:false,
                            labelString:barYlabel
                        }
                    }]                  
                },                              
            };
            graph = (
                <Bar options={options}
                    data={data}
                    height={137}
                />
            );
        }
        else if(this.props.graphType === GraphType.Trend){
            const data = LineDataset(this.props.trendData, this.state.dataType);
            const options = {
                legend: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            autoSkip: false,
                        },
                    }],
                },
            };
            graph = (
                <Line options={options}
                    data={data}
                    height={137}
                />
            );
        }
        else{
            const data = PieDataset(this.props.PieData);
            const options = {
                legend: {
                    display: true,
                },
                
            };
            graph = (
                <Pie options={options}
                    data={data}
                />
            );
        }
        
        return (
            <div className={className} style={this.props.style}>
                {this.props.graphType === GraphType.Pie || this.props.showType === ShowType.Project?<div>
                    {graph}
                </div>:
                <div>
                <div className='MgeCarousel__title'>
                    {DataTypeToMessage(this.state.dataType)}
                    {this.props.graphType === GraphType.Trend ? trend : stat}
                </div>
                <div className='MgeCarousel__content'>
                    <div onClick={this.switchPrev} className='MgeCarousel__content__arrow'>
                        <img src={arrowLeft}/>
                    </div>
                    <div className='MgeCarousel__content__graph'>
                        {graph}
                    </div>
                    <div onClick={this.switchNext} className='MgeCarousel__content__arrow'>
                        <img src={arrowRight}/>
                    </div>
                </div>
                {dots}
                </div>
            }
            </div>
        );
    }
}

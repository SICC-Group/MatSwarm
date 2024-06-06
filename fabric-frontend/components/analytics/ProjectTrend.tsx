import React, { Component } from 'react';

import { Spin } from 'antd';
import { autobind } from 'core-decorators';
import { Line } from 'react-chartjs-2';
import { TEXT } from '../../locale/Text';
import { TrendData } from '../../apis/project/Analystics';
import arrowLeft from '../../img/analytics_arrow_left.png';
import arrowRight from '../../img/analytics_arrow_right.png';

import './MgeCarousel.less';

export enum DataType {
    View = 'view',
    Download = 'download',
    Data = 'data',
    Template = 'template',
}

export enum ShowType {
    All, DataTemplate, ViewDownload,
}

export interface MgeCarouselProps {
    className?: string;
    style?: React.CSSProperties;

    showType: ShowType;
    trendData?: TrendData[];
    loading?: boolean;
}

interface State {
    dataType: DataType;
}

const view = TEXT('analytics:view', '查看量');
const downlaod = TEXT('analytics:download', '下载量');
const dataCount = TEXT('analytics:data_count', '数据量');
const templateCount = TEXT('analytics:template_count', '模板量');

const trend = TEXT('analytics:trend_graph', '趋势图');

function DataTypeToMessage(dataType: DataType): JSX.Element {
    switch (dataType) {
        case DataType.View: return view;
        case DataType.Download: return downlaod;
        case DataType.Data: return dataCount;
        case DataType.Template: return templateCount;
    }
}

function LineDataset(trendData: TrendData[], dataType: DataType) {

    const data = trendData.map((value) => {
        switch (dataType) {
            case DataType.Data: return value.data[3];
            case DataType.Template: return value.data[2];
            case DataType.Download: return value.data[1];
            case DataType.View: return value.data[0];
        }
    });

    return {
        labels: trendData.map((value) => `${Math.floor(value.date / 100)}/${value.date % 100}`),
        datasets: [
            {
                data,
                borderColor: '#5AA6C7',
                backgroundColor: 'rgba(90,166,199,0.20)',
            },
        ],
    };
}

const typeAll = [DataType.Data, DataType.Template, DataType.View, DataType.Download];
const typeViewDownload = [DataType.View, DataType.Download];
const typeDataTemplate = [DataType.Data, DataType.Template];

export class ProjectTrend extends Component<MgeCarouselProps, State> {

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
                        <Spin />
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


        return (
            <div className={className} style={this.props.style}>
                <div className='MgeCarousel__title'>
                    {DataTypeToMessage(this.state.dataType)}
                    {trend}
                </div>
                <div className='MgeCarousel__content'>
                    <div onClick={this.switchPrev} className='MgeCarousel__content__arrow'>
                        <img src={arrowLeft} />
                    </div>
                    <div className='MgeCarousel__content__graph'>
                        {graph}
                    </div>
                    <div onClick={this.switchNext} className='MgeCarousel__content__arrow'>
                        <img src={arrowRight} />
                    </div>
                </div>
                {dots}
            </div>
        );
    }
}

import React, { FC, useState, Component } from 'react';

import { QueryResultItem } from '../../apis/search/v2/Query';
import './SearchResultList.less';
import { Button, Rate, Popconfirm, message, Icon, Pagination } from 'antd';
import { Urls } from '../../apis/Urls';
// import { Cart } from '../../utils/ShoppingCart';
import { ScoreData } from '../../apis/data/Score'
import { autobind } from 'core-decorators';
import { Info } from '../../apis/session/Info';
import {FormattedMessage} from 'react-intl';

const ButtonGroup = Button.Group;
// const cart = Cart.Instance;

function confirm(data_id: number, score: number) {
    console.log(data_id, score);
    ScoreData(data_id, score).then((value) => {
        message.success('Success');
    }).catch((value) => {
        message.error(value + '');
    });
}
function cancel(e: any) {
    //message.error('Click on No');
}

const openData = (data_id: number) => {
    console.log(data_id);
    const data_url = Urls.storage.show_data(data_id);
    window.open(data_url);
};
const editData = (data_id: number) => {
    // const data_add = Urls.storage.add_data;
    // let data_url = data_add + '?action=modify&did=';
    // data_url = data_url + data_id;
    let data_url = Urls.storage.edit_data_new +  data_id;
    window.open(data_url);
};
const dellTime = (data_time: string) => {
    const arr1 = data_time.split('T', 1);
    const replaceStr = arr1[0].replace(/-/g, '/');
    return replaceStr;
};

export interface Props {
    data: QueryResultItem[];
    count: number;
    page_size: number;
    page: number;
    init?: boolean;
    onAddData: (dataID: number) => void;
    onRemoveData: (dataID: number) => void;
    onPageChange: (newPage: number) => void;
}
export interface State {
    score: number;
    logged_in: boolean;
    showExpand: boolean; // 用于控制数据摘要过长时是否展开
    // data_id_arr: number[];
    // data_in_arr: boolean[];
}
export class SearchResultList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        let data_id_arr1 = [];
        let data_in_arr1 = [];        
        for (let i = 0; i < this.props.data.length; i++) {            
            data_id_arr1.push(this.props.data[i].data.id);
            data_in_arr1.push(this.props.data[i].download);
        }
        this.state = {
            score: 0,
            logged_in: false,
            showExpand: false, // 用于控制数据摘要过长时是否展开
        };
    }

    componentDidMount() {
        Info().then((value) => {
            this.setState({
                logged_in: true,
            });
        }).catch(() => {
            this.setState({
                logged_in: false,
            });
        });
    }

    handleAbstract=()=>{
        const showExpand = this.state.showExpand
        this.setState({
            showExpand: !showExpand,
        })
    }

    @autobind
    dataScore(value: number){
        console.log(value);
        this.setState({
            score: value,
        });
    }

    @autobind
    addData(data_id: number, data_title: string, data_tid: number){
        this.props.onAddData(data_id);
    }
    @autobind
    removeData(data_id: number, data_tid: number){
        this.props.onRemoveData(data_id);
    }
    @autobind
    isDataInDownload(data_id: number){
        const data = this.props.data;
        for (let i = 0; i < data.length; ++i) {
            if (data[i].data.id === data_id) {
                return data[i].download;
            }
        }
        return false;
    }
    ExpandDiv(value: any){
        if(value.length > 50 ){
            if (!this.state.showExpand){
                return <a onClick={this.handleAbstract}>...</a>
            }
            else return <span><span className='abstract'>{value.substring(50)}</span>
                <a style={{paddingLeft: '3px'}} onClick={this.handleAbstract}><FormattedMessage id='click_collapse' defaultMessage='点击收起' /></a></span>
        }
        else {return <div>{''}</div>}
    }

    render() {
        return (
            <div>
                <div>
                    <h3 className='left_float'>{this.props.count} </h3>
                    <div> 结果</div> 
                </div>
                {this.props.data.map((v) => {
                    const dataIn = this.isDataInDownload(v.data.id);
                    return (
                        <div className='data_meta' key={v.data.id}>
                            <div className='heading'>
                                <a onClick={() => openData(v.data.id)} className='heading__title'>{v.data.title}</a>
                                <ButtonGroup className='heading__buttonGroup'>
                                    <Button onClick={() => editData(v.data.id)}><i className='fa fa-pencil' /></Button>
                                    <Popconfirm
                                        title={<Rate onChange={this.dataScore} />}
                                        onConfirm={() => confirm(v.data.id, this.state.score)}
                                        onCancel={cancel}
                                        okText='Yes'
                                        cancelText='No'
                                        icon={<Icon type='' />}
                                    >
                                        {this.state.logged_in ? (<Button><i className='fa fa-star' /></Button>) : (null)}
                                    </Popconfirm>
                                    <Button onClick={dataIn ? () => this.removeData(v.data.id, v.data.template) : () => this.addData(v.data.id, v.data.title, v.data.template)} type={dataIn ? 'primary' : 'default'}>
                                        <i className={dataIn ? 'fa fa-check' : 'fa fa-plus'} />
                                    </Button>
                                </ButtonGroup>
                            </div>
                            <div className='body'>
                                <p>
                                    <span className={v.data.realname ? 'body__midleft' : 'none'}>提交者：</span>
                                    <span className={v.data.realname ? 'body__midright' : 'none'}>{v.data.realname}</span>
                                    <span className='body__midleft'>提交时间：</span>
                                    <span className='body__midright'>{dellTime(v.data.add_time)}</span>
                                </p>
                                <div className='row'>
                                    <div className='body__bottom'>
                                        <ul className='body__bottom__listUL'>
                                            <li>
                                                <span className='fontWei'>材料类别：</span>
                                                <span>{v.data.category_name}</span>
                                            </li>
                                            <li>
                                                <span className='fontWei'>数据摘要：</span>
                                                {
                                                    v.data.abstract.length >50 ?
                                                        <span className='abstract'>{v.data.abstract.slice(0,50)}</span> :
                                                        <span className='abstract'>{v.data.abstract}</span>
                                                }
                                                {this.ExpandDiv(v.data.abstract)}
                                            </li>
                                            <li>
                                                <span className='fontWei'>DOI：</span>
                                                <span>{v.data.doi}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='body__bottom'>
                                        <ul className='body__bottom__listUL'>
                                            <li>
                                                <span className='fontWei'>来源：</span>
                                                <span>{v.data.source}</span>
                                            </li>
                                            <li>
                                                <span className='fontWei'>项目：</span>
                                                <span>{v.data.project}</span>
                                            </li>
                                            <li>
                                                <span className='fontWei'>引用：</span>
                                                <span>{v.data.reference}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='body__pullRight'>
                                        <div className='tiny'>
                                            <div className='value'>{v.data.views}</div>
                                            <div className='label'>查看</div>
                                        </div>
                                        <div className='tiny'>
                                            <div className='value'>{v.data.downloads}</div>
                                            <div className='label'>下载</div>
                                        </div>
                                        <div className='tiny'>
                                            <div className='value'>{v.data.score}</div>
                                            <div className='label'>评分</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>);
                })}
                <div className='center'>
                    <Pagination 
                        onChange={(page) => this.props.onPageChange(page)}
                        current={this.props.page} size={'big'} pageSize={this.props.page_size} total={this.props.count} />
                </div>
            </div>
        );
    }
}

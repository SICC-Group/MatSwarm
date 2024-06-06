import { Tooltip } from 'antd';
import React, { Component, useState } from 'react';
import {FormattedMessage} from 'react-intl';
import { PhotoConsumer, PhotoProvider } from 'react-photo-view';
import 'react-photo-view/dist/index.css';
import Tiff from 'tiff.js';
import { Data } from '../../apis/define/Data';
import { Template } from '../../apis/define/Template';
import { GenerateUniqueID } from '../../utils/GenerateUniqueID';
import './ItemRender.less';
interface DataProps {
    name: string;
    template_content: Template.RawContent;
    data_content: Data.Content;
}

export class ItemRender extends Component<DataProps, any> {
    constructor(props: any) {
        super(props);
        const field = this.props.name;
        this.state = {
            tp: this.props.template_content[field],
            data: this.props.data_content[field],
        };
    }

    render() {
        return (
            <div>
                <Show_All name={this.props.name}
                    tp={this.state.tp} data={this.state.data} />
            </div>
        );
    }
}

function Show_String(props: { title: string; data: string; suffix: string; }) {
    const flag = props.data.length > 50; // 为避免显示内容过长，字符串长度大于50时要做特殊处理
    if (!flag) {
        return (
            <div className='item_card'>
                <div className='string_left'>{props.title ? props.title + ':' : null}</div>
                <div className='string_body' dangerouslySetInnerHTML={{ __html: props.data + props.suffix }}></div>
            </div>
        );
    }
    else {
        const id = props.data;
        const full = document.getElementById('string_full' + id);
        const short = document.getElementById('string_short' + id);
        const Show_full = () => {
            full.style.display = 'block';
            short.style.display = 'none';
        };
        const Show_short = () => {
            full.style.display = 'none';
            short.style.display = 'block';
        };
        const content = <div id={'string_full' + id} style={{ display: 'none' }}>
            <div className='string_body' dangerouslySetInnerHTML={{__html: props.data + props.suffix}}/>
            <a onClick={() => { Show_short(); }}><FormattedMessage id='click_collapse' defaultMessage='点击收起' /></a>
        </div>;
        const content_short = <div id={'string_short' + id} style={{ display: 'block' }}>
            <div className='string_body' dangerouslySetInnerHTML={{__html: props.data.substr(0, 50) + props.suffix}}/>
            <a onClick={() => { Show_full(); }}>......</a>
        </div>;
        return (
            <div className='item_card'>
                <div className='string_left'>{props.title ? props.title + ':' : null}</div>
                {content}
                {content_short}
            </div>
        );
    }
}
function Show_Tif(props: { showtif: string; item: string; }) {
    const [baseurl, setbaseurl] = useState('');
    if (props.item.slice(-3) === 'tif' || props.item.slice(-3) === 'TIF' || props.item.slice(-4) === 'TIFF' || props.item.slice(-4) === 'tiff') {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.open('GET', encodeURI(props.showtif));
        xhr.onload = function(e) {
            const tiff = new Tiff({ buffer: xhr.response });
            setbaseurl(tiff.toDataURL());
        };
        xhr.send();
        return (
            <div>
                <PhotoProvider photoClosable>
                    <PhotoConsumer
                        src={baseurl}>
                        <Tooltip title='点击放大查看'>
                            <img style={{ width: '50%' }} className='img' src={baseurl}></img>
                        </Tooltip>
                    </PhotoConsumer>
                </PhotoProvider>
            </div>
        );
    }
    else { return (
        <div>
            <PhotoProvider photoClosable>
                <PhotoConsumer
                    src={encodeURI(props.item)}>
                    <Tooltip title='点击放大查看'>
                        <img style={{ width: '50%' }} className='img' src={encodeURI(props.item)}></img>
                    </Tooltip>
                </PhotoConsumer>
            </PhotoProvider>
        </div>

    );
    }

}

function Show_Pictures(props: { data: any; title: string; }) {
    if (props.data === null) {
        return (
            <div></div>
        );
    }
    if (!props.data) {
        return (
            <div></div>
        );
    }
    const id = GenerateUniqueID();
    if (props.data.length === 0) {
        return (
            <div></div>
        );
    }
    if (props.data.length >= 1) {
        return (
            <div className='panel_default'>
                <div className='panel_heading'>
                    <h4 id={id} className='panel_title'>{props.title}</h4>
                </div>
                {props.data.map((item: any) => {
                    const cn = item.split('/').pop();
                    const temp = cn.split('.').pop();
                    if (temp === 'png' || temp === 'jpg' || temp === 'tif' || temp === 'gif' || temp === 'bmp' || temp === 'webp') {
                        return (

                            <div className='panel_body'>
                                {
                                    <div>
                                        <Show_Tif showtif={temp} item={item}></Show_Tif>
                                    </div>
                                }
                            </div>
                        );
                    }
                    else { return (
                        <h4 className='panel_body'><a href={encodeURI(item)} download=''> {cn}</a></h4>
                    );
                    }
                })
                }</div>);
    }

}

function Show_Files(props: { data: any; title: string; }) {
    if (props.data === null) {
        return (
            <div></div>
        );
    }
    if (!props.data) {
        return (
            <div></div>
        );
    }
    const id = GenerateUniqueID();
    if (props.data.length === 0) {
        return (
            <div></div>
        );
    }
    if (props.data.length >= 1) {
        return (
            <div className='panel_default'>
                <div className='panel_heading'>
                    <h4 id={id} className='panel_title'>{props.title}</h4>
                </div>
                {props.data.map((item: any) => {
                    const cn = item.split('/').pop();
                    const temp = cn.split('.').pop();
                    if (temp === 'png' || temp === 'jpg' || temp === 'tif' || temp === 'gif' || temp === 'bmp' || temp === 'webp') {
                        return (

                            <div className='panel_body'>
                                {
                                    <div>
                                        <Show_Tif showtif={temp} item={item}></Show_Tif>

                                    </div>
                                }
                            </div>
                        );
                    }
                    else { return (
                        <h4 className='panel_body'><a href={encodeURI(item)} download=''> {cn}</a></h4>
                    );
                    }
                })
                }</div>);
    }
}

function Show_Array(props: { data: any[]; title: string; tp: { r: boolean; t: number; misc: any; } }) {
    if (!props.data) {
        return (
            <div></div>
        );
    } else {
        let props_slice = [];
        let slice_text = null;
        if (props.data.length > 1000 && (typeof props.data[0] === 'object')){
            props_slice = props.data.slice(0, 1000);
            slice_text = <FormattedMessage id='dataShow:Advice' defaultMessage='该数组下数据过多，仅显示前1000条，建议下载数据获得全部信息'/>;
        }
        else {
            props_slice = props.data
        }
        return (
            <div className='panel_default'>
                <div className='panel_heading'>
                    <div className='panel_title'>
                        {props.title}
                    </div>
                </div>
                <div className='panel_body'>
                    {slice_text != null ? <div style={{fontWeight: 'bold', color: 'red'}}>{slice_text}</div> : null}
                    {props_slice.map((item: any, index) => {
                        return (
                            <div key={index + String(item)}>
                                <Show_All name={'# ' + (index + 1)} tp={props.tp} data={item} />
                            </div>);
                    })}
                </div>
            </div>
        );
    }
}

function Show_Table(props: { data: any[]; new_content: any }) {
    if (!props.data) {
        return (
            <div></div>
        );
    }
    return (
        <div className='panel_body' style={{ maxHeight: '800px', overflow: 'scroll' }}>
            <table className='table_body'>
                <thead>
                    <tr className='table_border'>
                        <th className='table_th'>#</th>
                        {props.new_content._head.map((item: string) => {
                            return (
                                <th className='table_th'>{item}</th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item, index) => {
                        return (
                            <tr className={index % 2 - 1 ? 'table_body1' : 'table_body0'}>
                                <td className='table_td_i'>{index}</td>
                                {props.new_content._head.map((item_title: string) => {
                                    const field = '' + item_title;
                                    if (!item[field] && item[field] !== 0) {
                                        return (
                                            <td className='table_td'>
                                            </td>
                                        );
                                    }
                                    return (
                                        <td key={item_title} className='table_td'>
                                            <Show_All name='' tp={props.new_content[field]} data={item[field]} />
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

        </div>
    );
}

function Show_Container(props: { new_content: Template.RawContent; data: Data.Content; }) {
    return (
        <div className='panel_body'>
            {props.new_content._ord.map((item: string) => {
                if (props.data[item] == null) {
                    return (
                        <div key={item}></div>
                    );
                }
                return (
                    <div key={item}>
                        <ItemRender name={item} template_content={props.new_content} data_content={props.data} />
                    </div>);
            })}
        </div>
    );
}

function Show_Generator(props: { new_content: Template.RawContent; data: Data.Content; }) {
    return (
        <div className='panel_body'>
            {props.new_content._opt.map((item: string) => {
                if (props.data[item] == null) {
                    return (
                        <div key={item}></div>
                    );
                }
                return (
                    <div key={item}>
                        <ItemRender name={item} template_content={props.new_content} data_content={props.data} />
                    </div>);
            })}
        </div>
    );
}
function Show_Panel(props: { data_type: string; title: string; new_content: any; data: any; }) {
    if (props.data_type === 'table') {
        return (
            <div className='panel_default'>
                <div className='panel_heading'>
                    <h4 className='panel_title'>
                        {props.title}
                    </h4>
                </div>
                <Show_Table new_content={props.new_content} data={props.data} />
            </div>
        );
    } else if (props.data_type === 'container') {
        return (
            <div className='panel_default'>
                <div className='panel_heading'>
                    <h4 className='panel_title'>
                        {props.title}
                    </h4>
                </div>
                <Show_Container new_content={props.new_content} data={props.data} />
            </div>
        );
    } else if (props.data_type === 'generator') {
        return (
            <div className='panel_default'>
                <div className='panel_heading'>
                    <h4 className='panel_title'>
                        {props.title}
                    </h4>
                </div>
                <Show_Generator new_content={props.new_content} data={props.data} />
            </div>
        );
    }
}

function Show_All(props: { tp: { r: boolean; t: number; misc: any; }; name: string; data: any; }) {
    // 字符串、候选
    if (props.tp.t === 1 || props.tp.t === 6) {
        return (
            <div>
                <Show_String title={props.name} data={props.data} suffix='' />
            </div>
        );
    }
    // 数值 suffix单位
    if (props.tp.t === 2) {
        let getUnit = '';
        if (props.tp.hasOwnProperty('misc') && props.tp.misc.hasOwnProperty('unit') && props.tp.misc.unit !== null) {
            getUnit = props.tp.misc.unit;
        }
        return (
            <div>
                <Show_String title={props.name} data={props.data} suffix={getUnit} />
            </div>
        );
    }
    // 范围
    if (props.tp.t === 3) {
        if (props.tp.misc.type === 0) {
            // 范围型
            const ub = (props.data.ub == null ? '?' : props.data.ub);
            const lb = (props.data.lb == null ? '?' : props.data.lb);
            if (ub === lb) {
                return (
                    <div>
                        <Show_String title={props.name} data={ub} suffix={(props.tp.misc.unit == null ? '' : props.tp.misc.unit)} />
                    </div>
                );
            }
            else {
                return (
                    <div>
                        <Show_String title={props.name} data={lb + '~' + ub} suffix={(props.tp.misc.unit == null ? '' : props.tp.misc.unit)} />
                    </div>
                );
            }
        } else if (props.tp.misc.type === 1) {
            // 误差型
            const val = (props.data.val == null ? '?' : props.data.val);
            const err = (props.data.err == null ? '?' : props.data.err);
            return (
                <div>
                    <Show_String title={props.name} data={val + '±' + err} suffix={(props.tp.misc.unit == null ? '' : props.tp.misc.unit)} />
                </div>
            );
        } else {
            return (
                <div></div>
            );
        }

    }
    // 图片
    if (props.tp.t === 4) {
        return (
            <div>
                <Show_Pictures title={props.name} data={props.data} />
            </div>
        );
    }
    // 文件
    if (props.tp.t === 5) {
        return (
            <div>
                <Show_Files title={props.name} data={props.data} />
            </div>
        );
    }

    // 数组
    if (props.tp.t === 7) {
        return (
            <div>
                <Show_Array title={props.name} tp={props.tp.misc} data={props.data} />
            </div>
        );
    }
    // 表格
    if (props.tp.t === 8) {
        return (
            <div className='item_card'>
                <Show_Panel new_content={props.tp.misc} title={props.name} data={props.data} data_type='table' />
            </div>
        );
    }
    // 容器
    if (props.tp.t === 9) {
        return (
            <div >
                <Show_Panel new_content={props.tp.misc} title={props.name} data={props.data} data_type='container' />
            </div>
        );
    }
    // 生成器
    if (props.tp.t === 10) {
        return (
            <div className='item_card'>
                <Show_Panel new_content={props.tp.misc} title={props.name} data={props.data} data_type='generator' />
            </div>
        );
    }
}

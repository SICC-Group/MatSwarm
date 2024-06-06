import React, { FC, useEffect, useState } from 'react';
import {FormattedMessage} from 'react-intl';
import Urls from '../../apis/Urls';
import {Breadcrumb, BreadcrumbItem} from '../layout/Breadcrumb';
import {MgeLayout} from '../layout/MgeLayout';
import {Row, Col, Pagination } from 'antd';
import {GetUploadHistoryData} from '../../apis/uploads/Get';
import {TEXT} from '../../locale/Text';
import './DataList.less';

const breadcrumbItems: BreadcrumbItem = 
  {
    title: <FormattedMessage id='user:history' defaultMessage='上传历史' />
  }

export const DataList: FC<any> = (props) => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    useEffect(() => {
        const id = Number(window.location.href.split('/').pop());
        GetUploadHistoryData(id).then((res: any) => {
            setDataSource(res.results);
            setTotal(res.total);
            setPage(res.current_page);
        });
    },[]);
    const handlePageChange = (newPage: number) => {
        const id = Number(window.location.href.split('/').pop());
        GetUploadHistoryData(id, newPage, pageSize).then((res: any) => {
            setDataSource(res.results);
            setTotal(res.total);
            setPage(res.current_page);
        });
    };
    const showAbstract = (value: any) => {
        if(value.length > 50) {
            return <span style={{wordWrap: 'break-word'}}>{value.slice(0,50)} ... </span>
        }
        else {
            return <span style={{wordWrap: 'break-word'}}>{value}</span>
        }
    }
    return (
        <MgeLayout loginRequired>
            <div style={{overflowY: 'scroll'}}>
                <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems]} />
                {
                    dataSource.map((item: any) => {
                        return (
                            <div className='data_card'  onClick={()=>{window.open('/storage/data/'+ item.id)}}>
                                <div className='data_card_header'>
                                    <span className='data_card_header_title'>{item.title}</span>
                                    <div>
                                        <span style={{fontWeight: 'bold'}}>{TEXT('data:keywords', '关键词：')}</span>
                                        {
                                            item.keywords.map((word: any) => {
                                                return <span className='data_card_header_label'>{word}</span>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='data_card_body'>
                                    <p>
                                        <span className='data_card_body_text_bold'>{TEXT('author', '提交者：')}</span>
                                        <span className='data_card_body_text'>{item.author}</span>
                                        <span className='data_card_body_text_bold'>{TEXT('add_time', '提交时间：')}</span>
                                        <span className='data_card_body_text'>{item.add_time}</span>
                                    </p>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <div>
                                                <span style={{fontWeight: 'bold'}}>{TEXT('category', '材料类别：')}</span>
                                                <span style={{wordWrap: 'break-word'}}>{item.category}</span>
                                            </div>
                                            <div >
                                                <span style={{fontWeight: 'bold'}}>{TEXT('data:abstract', '数据摘要：')}</span>
                                                <span style={{wordWrap: 'break-word'}}>{showAbstract(item.abstract)}</span>
                                            </div>
                                            <div>
                                                <span style={{fontWeight: 'bold'}}>DOI: </span>
                                                <span style={{wordWrap: 'break-word'}}>{item.doi === '' ? '无' : item.doi }</span>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div>
                                                <span style={{fontWeight: 'bold'}}>{TEXT('source', '来源：')}</span>
                                                <span style={{wordWrap: 'break-word'}}>{item.source}</span>
                                            </div>
                                            <div>
                                                <span style={{fontWeight: 'bold'}}>{TEXT('dash:project', '项目：')}</span>
                                                <span style={{wordWrap: 'break-word'}}>{item.project}</span>
                                            </div>
                                            <div>
                                                <span style={{fontWeight: 'bold'}}>{TEXT('data:ref', '引用：')}</span>
                                                <span style={{wordWrap: 'break-word'}}>{item.reference}</span>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className='data_card_body_statistic'>
                                                <div className='data_card_body_statistic_value'>{item.views}</div>
                                                <div className='data_card_body_statistic_label'>{TEXT('views', '查看量')}</div>
                                            </div>
                                            <div className='data_card_body_statistic'>
                                                <div className='data_card_body_statistic_value'>{item.downloads}</div>
                                                <div className='data_card_body_statistic_label'>{TEXT('analytics:downloads', '下载量')}</div>
                                            </div>
                                            <div className='data_card_body_statistic'>
                                                <div className='data_card_body_statistic_value'>{item.score}</div>
                                                <div className='data_card_body_statistic_label'>{TEXT('score', '评分')}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <Pagination total={total}
                        pageSize={pageSize}
                        current={page}
                        onChange={(page)=>{handlePageChange(page)}}
                        style={{margin: '10px'}}
            />
        </MgeLayout>
    );
};

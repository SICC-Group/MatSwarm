import React, { FC, useEffect, useState } from 'react';
import {Table, Button, Divider, notification, Popconfirm,Modal,DatePicker,Radio } from 'antd';
import {TEXT} from '../../locale/Text';
import { PaginationConfig } from 'antd/lib/table';
import {RevokeUploadHistory, RevokeUploadHistory1, RevokeData_cache} from '../../apis/uploads/Revoke';
import {ModifyPubdate, GetUploadHistoryData1} from '../../apis/uploads/Get';
import { RouteComponentProps, withRouter } from 'react-router';
import {MgeError} from '../../apis/Fetch';
import locale from 'antd/es/date-picker/locale/zh_CN'
const Column = Table.Column;

export interface UploadsHistoryViewerProps {
    page: number;
    page_size: number;
    data: any[];
    total: number;
    loading ?: boolean;
    onPageChange: (newPage: number) => void;
}

const _UploadsHistoryViewer: FC<UploadsHistoryViewerProps & RouteComponentProps> = (props) => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [ModalVisible,setModalVisible] = useState<boolean>(false);
    const [hisId,setHisId] = useState<number>(null);//存储上传历史id
    const [value, setValue] = useState<string>(null); //公开范围
    const [newDate,setnewDate] = useState<string>(null);//公开时间
    useEffect(() => {
        setDataSource(props.data);
    }, [props.data]);

    const handleTableChange = (pagination: PaginationConfig) => {
        props.onPageChange(pagination.current);
    };

    const handleRevokeData = (record: any) =>{
        // 大科学装置平台数据需要调用两个撤回接口
        if (record.platform_belong === '大科学装置汇交平台'){
            GetUploadHistoryData1(record.id, true).then((result: any) => {
                RevokeUploadHistory1(result.data_meta_ids).then((res: any) =>{
                    if (res.msg === '调用成功'){
                        RevokeUploadHistory(record.id).then( res_ => {
                            location.reload()
                        }).catch((reason: MgeError) => {
                            notification.error({
                                message: reason.message
                            })
                        })
                    }
                    else {
                        notification.error({
                            message: res.msg
                        })
                    }
                })
            })
        }
         // 高通量计算汇交平台撤回
        else if (record.platform_belong === '高通量计算汇交平台'){
            // 先根据上传历史id获取数据id
            GetUploadHistoryData1(record.id, true).then((result: any) => {
                // 获取到的数据id为数组，需要依次调用撤回接口
                result.data_meta_ids.map((data_item: any, index: number) => {
                    RevokeData_cache(data_item).then((res: any) => {
                        // 等高通量接口全部调用完毕后，再根据上传历史id在本系统撤回
                        if (index === result.meta_id_list.data_list.length - 1){
                            RevokeUploadHistory(record.id).then( res_ => {
                                location.reload()
                            }).catch((reason: MgeError) => {
                                notification.error({
                                    message: reason.message
                                })
                            })
                        }
                    })
                })
            })
        }
        else {
            RevokeUploadHistory(record.id).then((res: any) => {
                location.reload();
            }).catch((reason: MgeError) => {
                notification.error({
                    message: reason.message,
                })
            });
        }
    };
    const handleChange = (e:any) => { //获取公开范围值
        setValue(e.target.value);
      };
    function onChange(value:any, dateString:any) { //获取公开时间值
        setnewDate(dateString);
    }
    const handleOk = () => {  //提交
        ModifyPubdate(hisId,newDate,value).then((res:any)=>{
            notification.success({
                message:'修改成功'
            })
        })
        setModalVisible(false);
      };
      const handleCancel = () => {
        setModalVisible(false);
    };
    return (
        <div>
            <Table onChange={handleTableChange}
                   rowKey={'id'}
                   dataSource={dataSource}
                   loading={props.loading}
                   pagination={{ total: props.total, pageSize: props.page_size, current: props.page }}
            >
                <Column title={TEXT('dash:time', '上传时间')} dataIndex='upload_time' key='upload_time' />
                <Column title={TEXT('dash:pub_date','公开时间')} dataIndex='public_date' key='public_date' />
                <Column title={TEXT('dash:data_count', '数据量')} align='center' dataIndex='data_count' key='data_count' />
                <Column title={TEXT('data:title', '数据标题')} align='center'  width='350px' dataIndex='title' key='title'  ellipsis={true}/>
                <Column title={TEXT('dash:uploaded_via', '上传方式')} dataIndex='upload_via' key='upload_via'
                        render={(text, record) => {
                            return (<span>{text === true ? '表单上传' : '网页上传'}</span>);
                        }} />
                <Column title={TEXT('dash:reviewer', '审核人')} dataIndex='reviewer' key='reviewer' />
                <Column title={TEXT('dash:status', '状态')} dataIndex='review_state' key='review_state' />
                <Column title={TEXT('dash:action', '操作')}  width='250px'  render={(text: any, record: any) => {
                    const RevokeData = <Popconfirm title={'确定撤回数据？'}  onConfirm={()=>{handleRevokeData(record)}}>
                        <Button size='small' type='danger'>{TEXT('dash:revoke_data', '撤回数据')}</Button></Popconfirm>;
                    // const ViewData = <Button onClick={() => {window.open(window.location + 'data_list/' + record.id)}}>{TEXT('data:view_data', '查看数据')}</Button>;
                    const ViewData = <Button size='small'><a target='_blank' href={'#/data_list/' + record.id}>{TEXT('data:view_data', '查看数据')}</a></Button>;
                    const Modify_Publicdate = <Button size='small' style={{marginTop:'5px'}} onClick={()=>{setHisId(record.id);setModalVisible(true)}}>{TEXT('dash:modify_pubdate','修改公开时间')}</Button>
                    if (record.review_state === '审核通过'){
                        if(record.is_accepted === 'true') return ViewData;
                            else return (<div>{ViewData}<Divider type='vertical' />{Modify_Publicdate}</div>);
                    }
                    else { return <div>{RevokeData}<Divider type='vertical' />{ViewData}<Divider type='vertical' />{Modify_Publicdate}</div>;}
                }}/>
            </Table>
            <Modal title='修改公开时间' onCancel={handleCancel} onOk={handleOk} visible={ModalVisible} style={{height:'100%'}}
            cancelText='取消'  okText='确认'>
                <div style={{height:'300px'}}>
                <p>请选择公开时间：</p>
                <DatePicker locale={locale} showTime onChange={onChange}/>
                <p style={{marginTop:'50px'}}>请选择公开范围：</p>
                <Radio.Group onChange={handleChange} value={value}>
                <Radio value={'person'}>个人</Radio>
                <Radio value={'subject'}>课题</Radio>
                <Radio value={'project'}>项目</Radio>
                <Radio value={'public'}>公开</Radio>
                </Radio.Group>
                </div>
            </Modal>
        </div>
    )
}

export const UploadsHistoryViewer = withRouter(_UploadsHistoryViewer);


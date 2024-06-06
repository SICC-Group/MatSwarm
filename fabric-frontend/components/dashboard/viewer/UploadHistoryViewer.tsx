import React, { FC, useEffect, useState } from 'react';
import {ColumnFilterItem} from 'antd/es/table';
import { Table, Button, Input, Icon, notification, Divider, Tooltip, Modal } from 'antd';
import { PaginationConfig } from 'antd/lib/table';

import { ReviewState } from '../../../apis/define/ReviewState';
import { UploadHistoryAction } from './UploadHistoryAction';
import { UploadHistoryItemViewer } from '../item_viewer/UploadHistoryItemViewer';
import { UploadHistory } from '../../../apis/define/Upload';
import { RefuseUploadModal } from '../modal/RefuseUploadModal';
import { TEXT } from '../../../locale/Text';
import { ApproveUploadModal} from "../modal/ApproveUploadModal";
import {PassUpload} from "../../../apis/uploads/Review";
import {GetUploadHistory} from "../../../apis/uploads/Get";
import {WithdrawUpload} from "../../../apis/uploads/Review";
import { __values } from 'tslib';
import { platform } from 'chart.js';
export interface UploadHistoryViewerProps {
  // 是否显示管理员的内容
  admin: boolean;
  // 当前页的数据列表
  data: UploadHistory[];
  // 数据总量
  total: number;
  // 每个页面的大小
  pageSize: number;
  // 当前页码
  current: number;

  loading?: boolean;
  onPageChange: (newPage: number, real_name: string, subject: string) => void;

}

const Column = Table.Column;

export const UploadHistoryViewer: FC<UploadHistoryViewerProps> = (props) => {

  const [real_name, setReal_name] = useState('');
  const [subject, setSubject] = useState('')
  const handleTableChange = (pagination: PaginationConfig) => {
    props.onPageChange(pagination.current, real_name, subject);
  }
  const [innerData, setInnerData] = useState<UploadHistory[]>([]);
  useEffect(() => {
    setInnerData(props.data);
  }, [props.data]);


  const [showViewModal, setShowViewModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [currentViewRecord, setCurrentViewRecord] = useState<UploadHistory>(null);

  // 专门为数据多选设置的变量

  // const [selectedRows, setSelectedRows] = useState([]); // 选中行的内容
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中行的key
  const [currentViewRecordMulti, setCurrentViewRecordMulti] = useState([]);   // 多选传递的参数

  /*
  *  selectedRows会有跨页state清理的bug，导致无法跨页选取，但key不存在这个bug，跨页选择key是没问题的
  *  key设置成id  直接传参进行同意或拒绝的操作就好
  * */

  const [loading, setLoading] = useState(false);

  const [showApproveModal, setShowApproveModal] = useState(false);

  const informUpdate = () => {
    setInnerData([...innerData]);
  }

  const handleViewRecord = (record: UploadHistory) => {
    setCurrentViewRecord(record);
    setShowViewModal(true);
  }

  const handleRefuseRecord = (record: UploadHistory) => {
    setCurrentViewRecord(record);
    setShowRefuseModal(true);
  }
  const handleApproveRecord = (record: UploadHistory) => {
    setCurrentViewRecord(record);
    setShowApproveModal(true);
  }
  const handleWithdrawRecord = (record: UploadHistory) => { //撤回
    setCurrentViewRecord(record);
    setShowWithdrawModal(true);
  }
  const onSelectChange = (selectedRowKeys: any) => {
    // console.log(selectedRows);
    console.log(selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
    // setSelectedRows(selectedRows);
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  // 数据批量通过
  const handlePass = () => {
    setShowApproveModal(true);
    setCurrentViewRecordMulti(selectedRowKeys);
    setSelectedRowKeys([]);   // 重置多选框,不需要可注释掉
    // selectedRows.map(record => {
    //   PassUpload(record.id).then(() => {
    //     GetUploadHistory(record.id).then((result) => {
    //       Object.assign(record, result);
    //       informUpdate();
    //     })
    //   }).catch((reason: Error) => {
    //     notification['error']({
    //       message: reason.message,
    //     })
    //   })
    // })
  }
  // 数据批量拒绝
  const handleRefuse = () => {
    setCurrentViewRecordMulti(selectedRowKeys);
    setShowRefuseModal(true);
    setSelectedRowKeys([]);     // 重置多选框,不需要可注释掉
    // selectedRows.map( item => {
    //   handleRefuseRecord(item);
    // })
  }
  const handleWithdraw = () => { //撤回审核操作
    WithdrawUpload(currentViewRecord.id).then((value)=>{
      setShowWithdrawModal(false);
      Modal.success({content:'撤回成功！'})
      GetUploadHistory(currentViewRecord.id).then((result) => {
        Object.assign(currentViewRecord, result);
        informUpdate();
      })
      console.log(value);
    }).catch((error)=>{
      Modal.error({content:{error}})
    })
  }

  const columnRealNameSearch = () => {
    props.onPageChange(1, real_name,'' );
  }
  const columnRealNameReset = () => {
    setReal_name('');
    props.onPageChange(1, '','');
  }

  const columnSubjectReset = () => {
    setSubject('');
    props.onPageChange(1, '','');
  }

  const columnSubjectSearch = () => {
    props.onPageChange(1, '', subject );
  }

const getRealNameSearchProps = <div>
    <div style={{ padding: 8 }}>
        <Input
          style={{ width: 150, marginBottom: 8, display: 'block' }}
          value={real_name}
          onChange={e => setReal_name(e.target.value)}
        />
        <Button
          type="primary"
          icon="search"
          size="small"
          style={{ width: 70, marginRight: 8 }}
          onClick={columnRealNameSearch}
        >
          查找
        </Button>
        <Button onClick={columnRealNameReset}  size="small" style={{ width: 70 }}>
          重置
        </Button>
      </div>
  </div>

  const getSubjectSearchProps = <div>
    <div style={{ padding: 8 }}>
        <Input
          style={{ width: 150, marginBottom: 8, display: 'block' }}
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <Button
          type="primary"
          icon="search"
          size="small"
          style={{ width: 70, marginRight: 8 }}
          onClick={columnSubjectSearch}
        >
          查找
        </Button>
        <Button onClick={columnSubjectReset}  size="small" style={{ width: 70 }}>
          重置
        </Button>
      </div>
  </div>

  const hasSelected = selectedRowKeys.length > 0;
  const filters: ColumnFilterItem[] = [
    {
        text: TEXT('data:DISCREATE_DATA','离散数据汇交平台'),
        value: String(0),
    },
    {
        text: TEXT('data:Big_SCIENTIFIC','大科学装置汇交平台'),
        value: String(1),
    },
    {
        text: TEXT('data:DATABASE_TOOL','数据库汇交工具'),
        value: String(2),
    },
    {
        text: TEXT('data:HIGH_THROUGHPUT_COMPUTING','高通量计算汇交平台'),
        value: String(3),
    },
]

  return (
    <>
      <div>
        <Button type='primary' disabled={!hasSelected} onClick={handlePass} loading={loading}>{TEXT('dash:approve', '通过')}</Button>
        <Divider type='vertical'/>
        <Button type='danger' disabled={!hasSelected} onClick={handleRefuse}>{TEXT('dash:disapprove', '拒绝')}</Button>
      </div>
      <Table onChange={handleTableChange} rowKey={'id'}
        dataSource={innerData}  rowSelection={rowSelection}
             loading={props.loading} pagination={{ total: props.total, pageSize: props.pageSize, current: props.current}}>
        <Column title={TEXT('dash:ID', '编号')} dataIndex='id' key='id' />
        <Column title={TEXT('dash:upload_time', '上传时间')} dataIndex='time' key='time' render={text => new Date(text).toLocaleString()}/>
        <Column title={TEXT('dash:data_title', '数据名称')} dataIndex='data_title' key='data_title'  width={180} ellipsis={true} render={(title)=>{return(<Tooltip placement="topLeft" title={title}>{title}</Tooltip>)}}/>
        <Column title={TEXT('dash:subject', '课题')} dataIndex='subjcets' key='subjects' filterDropdown={getSubjectSearchProps} filterIcon={<Icon type="search" />}render={(text, record: UploadHistory) => {
          const subjects = record.subjects.toString() // subjects是数组
            return (<div>{subjects}</div>);
          }
        } />
        <Column title={TEXT('dash:data_count', '数据量')} dataIndex='count' key='count' />
        <Column title={TEXT('dash:method', '数据来源')}  key='platform_belong' 
        // filters = {filters}
        filterIcon = {<Icon type="down" />}
        // onFilter = {(value, record:any) => record.platform_belong.toString() === value}
         render={(text, record: UploadHistory) => {
          let content: React.ReactNode = null;
          switch (record.platform_belong) {
            case 0: content = TEXT('data:DISCREATE_DATA','离散数据汇交平台'); break;
            case 1: content = TEXT('data:Big_SCIENTIFIC','大科学装置汇交平台'); break;
            case 2: content = TEXT('data:DATABASE_TOOL','数据库汇交工具'); break;
            case 3: content = TEXT('data:HIGH_THROUGHPUT_COMPUTING','高通量计算汇交平台'); break;
        }
        return (
            <div>
                {content} <br />
            </div>
        );
        }} />
        <Column title={TEXT('dash:method', '上传方式')} key='uploaded_via' render={(text, record: UploadHistory) => {
          if (record.source == null) {
            return TEXT('dash:form', '网页表单');
          }
          else {
            return (
              <>
                {TEXT('dash:file', '文件')}&nbsp;
              </>
            )
          }
        }} />
        <Column title={TEXT('dash:uploader', '上传人')} dataIndex='real_name' key='uploader' filterDropdown={getRealNameSearchProps} filterIcon={<Icon type="search" />}/>
        <Column title={TEXT('dash:reviewer', '审核人')} dataIndex='reviewer_real_name' key='reviewer' />
        <Column title={TEXT('dash:status', '状态')} dataIndex='review_state' key='review_state' render={(text: ReviewState, record: UploadHistory) => {
          let content: React.ReactNode = null;

          switch (text) {
            case ReviewState.Approved: content = TEXT('dash:approved', '通过'); break;
            case ReviewState.Disapproved: content = <span style={{ color: 'red' }}>{TEXT('dash:disapproved', '未通过')}</span>; break;
            case ReviewState.Pending: content = TEXT('dash:pending', '等待审核'); break;
          }
          return (
            <div>
              {content} <br />
              {text === ReviewState.Disapproved ? record.disapprove_reason : null}
            </div>
          )
        }} />
        <Column
          width='200px'
          title={TEXT('dash:action', '操作')}
          key="action"
          render={(text, record: UploadHistory) => {
            return (
              <UploadHistoryAction admin onRefuse={handleRefuseRecord}
                informUpdate={informUpdate} onApprove={handleApproveRecord}
                onWithdraw = {handleWithdrawRecord}
                record={record} onView={handleViewRecord}/>
            )
          }
          }
        />
      </Table>
      <UploadHistoryItemViewer admin
        record={currentViewRecord}
        visible={showViewModal}
        onClose={() => setShowViewModal(false)}
        />
      <RefuseUploadModal visible={showRefuseModal} record_multi_id={currentViewRecordMulti} informUpdate={informUpdate}
                         onClose={() => setShowRefuseModal(false)} record={currentViewRecord}/>
      <ApproveUploadModal visible={showApproveModal} record_multi_id={currentViewRecordMulti} informUpdate={informUpdate}
                          onClose={() => setShowApproveModal(false)} record={currentViewRecord}/>
      <Modal
        title={TEXT('dash:withdraw','撤回审核')}
        visible={showWithdrawModal}
        onOk = {handleWithdraw}
        onCancel = {() =>{setShowWithdrawModal(false)}}
        okText={TEXT('submit','确定')}
        cancelText={TEXT('cancel','取消')}
      >
        <p>确定撤回审核吗？</p>
      </Modal>
    </>
  )
}

import React, { Component, FC, useEffect, useState } from 'react';

import { Button, Icon,  Select, Upload } from 'antd';

import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { InputFieldProps } from '../Props';

import { FileField } from '../../../../apis/define/Field';
import Urls from '../../../../apis/Urls';

import { ConfirmAndUpload, ConfirmDoneAndExist, PrepareData } from '../../../../apis/uploads/BigFile';
import {FormattedMessage} from "react-intl";

import './File.less';

// 切片大小，每次1M
const chunkSize = 1024 * 1024 * 1;
const { Option } = Select;
// 默认一次最大发送的分片数为100(并发post请求数100)
const maxSlices = 100;
// 允许最大上传大小 30G
const maxSize = 30 * 1024 * 1024 * 1024;
// 历史记录保留几次
const historySize = 5;

export const FileInputFieldContentAll: FC<InputFieldProps<FileField>> = (props) => {
  const { parent, name, informUpdate, field } = props;
  const [url_result, setUrl_result] = useState<any>([]); // 存储最后url和对应的文件uid顺序
  const [urlsR, setUrlsR] = useState([]); // 存储url
  const [uuidHistory, SetUuidHistory] = useState(''); // 存储选择好的历史uuid
  const [hisVisiblable, SetHisVisiblable] = useState(false); // 是否展示历史记录下拉框， true展示
  let toDeleteUid = ''; // 文件过大、续传失败的file-uid，用于删除,  因为要求及时性，所以没用state
  const[isUploading, setIsUploading]  = useState(false); // 用于只允许单文件的上传按钮隐藏。

  // 回调函数，状态更新时使用
  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    // console.log(info, toDeleteUid, isUploading);
    // 在文件列表中删除过大的文件， // 续传失败的
    if (toDeleteUid === info.file.uid) {
      info.fileList.pop();
    }
    // 删除文件的情况下
    if (info.file.status === 'removed'){
      var i;
      for (i = 0; i < url_result.length; i++) {
        if (url_result[i].uid === info.file.uid) { 
          // console.log(i, info.file.uid);
          break; 
        }
      }
      url_result.splice(i, 1);
      urlsR.splice(i, 1);
      if (info.fileList.length === 0) {
        setIsUploading(false);
      }
      parent[name] = urlsR;
      informUpdate();
      // console.log(url_result, urlsR);
    } 
  };

  // 上传前的判断
  const handleBeforeUpload = (file: any) => {
    // 如果该文件大于最大maxSize,则无法上传
    if (file.size > maxSize) {
      toDeleteUid = file.uid;
      alert('文件太大无法上传，最大支持30G');
      return false;
    }
    // 下面判断续传是否是原文件
    if (hisVisiblable) {
      console.log('续传');
      const hisArray = localStorage.filehistory.split('///');
      let i;
      for (i = 0; i < hisArray.length; i++) {
        if (JSON.parse(hisArray[i]).uuid === uuidHistory) {
          break;
        }
      }
      // 对其他信息进行核对
      if (JSON.parse(hisArray[i]).file.name === file.name && JSON.parse(hisArray[i]).file.size === file.size && JSON.parse(hisArray[i]).file.lastModified === file.lastModified && JSON.parse(hisArray[i]).file.type === file.type) {
        setIsUploading(true);
        return true;
      } else {
        alert('本次上传文件与记录不符，无法上传');
        toDeleteUid = file.uid;
        return false;
      }
    }
    setIsUploading(true);
    return true;
  };

  // 每次上传调用的函数，上传接口，具体上传功能调用veryBigFileInterface
  const doFileUpload = (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    console.log('开始大文件上传', file);
    // 初始化第一个分片起始终止位置
    let start_size = 0;
    let end_size = chunkSize - 1;
    const fileCount = Math.ceil(file.size / chunkSize); // 总的分片数，向上取整
    // 这里重新定义一个变量，state的值不能直接更新
    let haveDone1 = 0;
    PrepareData().then((value) => {
      const fileItem = {
        'uuid': value.uuid,
        'file': {
          'name' : file.name,
          'size' : file.size,
          'lastModified' : file.lastfileed,
          'type' : file.type,
        }
      };
      let fileItemString = JSON.stringify(fileItem);
      // 这里存近5次的思路，先把json=>string=>加到array[5]=>string(///)
      // 所以使用时的使用逆过程， string=>array=>取某个值string=>json 
      if (typeof (Storage) !== 'undefined') {
        if (localStorage.filehistory) {
          var arrayH = localStorage.filehistory.split('///');
          if (arrayH.length >= historySize) {
            arrayH = arrayH.slice(-(historySize - 1));
          }
          arrayH.push(fileItemString);
          localStorage.filehistory = arrayH.join('///');
        } else {  // 初始化历史消息
          localStorage.filehistory = [fileItemString].join('///');
        }
      } else {
        console.log('Sorry, your browser does not support web storage');
      }

      // 文件过大，导致请求太多，分批次发送
      const maxBatch = Math.ceil(fileCount / maxSlices); // 最大批数,向上取整
      let kuuid = value.uuid;
      if (uuidHistory && hisVisiblable) {
        kuuid = uuidHistory;
      }
      veryBigFileInterface(kuuid, file, fileCount, maxBatch, start_size, end_size, 0, haveDone1, onProgress, onSuccess);
    });
  };

  // 上传功能核心代码， 具体通过不断迭代实现
  const veryBigFileInterface = (uuid: string, file: any, fileCount: number, maxBatch: number, start_size: number, end_size: number,
    i: number, haveDone1: number, onProgress: any, onSuccess: any) => {
      // 如果达到最大的批数，结束
    if (i === maxBatch) {
      return 0;
    }
    // 重新定义一个变量，state的值不能直接更新
    let haveDone2 = 0;   // 当前批次已完成的数目
    console.log('文件分批次发送', fileCount, maxSlices, maxBatch, i);
    console.log('这是第 ' + (i + 1) + ' 批');
    for (let j = 0; j < maxSlices; j++) {
      if (i * maxSlices + j === fileCount) {
        break;
      }
      // console.log(i * maxSlices + j, fileCount, start_size, end_size);
      ConfirmAndUpload(file.slice(start_size, end_size), i * maxSlices + j , uuid, fileCount, file.name).then((res) => {
        haveDone1 += res;
        haveDone2 += res;
        console.log(haveDone1, fileCount, parseFloat((100 * haveDone1 / fileCount).toFixed(1)));
        onProgress({ percent: parseFloat((100 * haveDone1 / fileCount).toFixed(1)) });
        if (haveDone1 === fileCount) {
          // 最后的合并验证
          ConfirmDoneAndExist(file.slice(start_size, end_size), i * maxSlices + j, uuid, fileCount, file.name).then((resF) => {
            onSuccess(true);
            SetUuidHistory('');
            url_result.push({
              'uid': file.uid,
              'url': resF.data,
            });
            urlsR.push(resF.data);
            parent[name] = urlsR;
            informUpdate();
          });
        }
        if (haveDone2 === maxSlices) {
          console.log('第' + (i + 1) + '批已完成');
          i++;
          veryBigFileInterface(uuid, file, fileCount, maxBatch, start_size, end_size, i, haveDone1, onProgress, onSuccess);
        }
      });
      start_size += chunkSize - 1;
      end_size += chunkSize - 1;
    }
  };

  // 历史记录下拉框选择后调用
  const handleChangeHistory = (value: any) => {
    console.log(`selected ${value}`);
    SetUuidHistory(value);
  };
  // 令历史记录下拉框可见
  const showHistory = () => {
    SetHisVisiblable(true);
  };
  // 令历史记录下拉框不可见
  const showUnHistory = () => {
    SetHisVisiblable(false);
    SetUuidHistory('');
  };

  const uploadButton = (
    <div>
      <Button disabled={hisVisiblable && uuidHistory === ''}>
        {
          hisVisiblable ? (<div><Icon type='plus' /><FormattedMessage id='continue_upload' defaultMessage='继续上传'/></div>) : (<div><Icon type='plus' /><FormattedMessage id='upload' defaultMessage='上传'/></div>)
        }
      </Button>
    </div>
  );
  const uploadSelect = (
    <div>
      {
        typeof (Storage) !== 'undefined' &&  localStorage.filehistory  ? (
          <Select value={uuidHistory === '' ? undefined : uuidHistory} placeholder='只保留近5次的文件上传记录' style={{ width: 300, display: (hisVisiblable ? 'block' : 'none') }} onChange={handleChangeHistory}>
            {
              localStorage.filehistory.split('///').map((item: any) => {
                return (
                  <Option key={item === '' ? null : JSON.parse(item).uuid} value={item === '' ? null : JSON.parse(item).uuid}>{item === '' ? null : JSON.parse(item).file.name}</Option>
                );
              })
            }
          </Select>
        ) : (
            <Select value={uuidHistory === '' ? undefined : uuidHistory} placeholder='只保留近5次的文件上传记录' style={{ width: 300, display: (hisVisiblable ? 'block' : 'none') }} onChange={handleChangeHistory}>
            </Select>
          )
      }      
    </div>
  );
  const uploadIcon = (
    <Icon onClick={hisVisiblable ? showUnHistory : showHistory} type={hisVisiblable ? 'up' : 'right'} />
  );

  return (
    <div>
      {(!field.allowMulti && (url_result.length > 0 || isUploading)) ? null : uploadSelect}
      {(!field.allowMulti && (url_result.length > 0 || isUploading)) ? null : uploadIcon}
      <Upload
        action='#'
        name='files[]'
        data={{ type: 'file' }}
        customRequest={doFileUpload}
        onChange={handleChange}
        beforeUpload={handleBeforeUpload}
      >
        {(!field.allowMulti && (url_result.length > 0 || isUploading)) ? null : uploadButton}
      </Upload>
    </div>
  );
};

export const FileInputFieldContent: FC<InputFieldProps<FileField>> = (props) => {
  const { parent, name, informUpdate, field } = props;

  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    // change toJSON method
    const list = info.fileList.map((value, index) => {
      (value as any).toJSON = function () {
        if (this.status === 'done') {
          return this.response.data[0];
        }
        else {
          return '_Uploading';
        }
      }
      console.log(value);
      return value;
    })

    if (!field.allowMulti) {
      parent[name] = list[0];
    }
    else {
      parent[name] = list;
    }
    informUpdate();
  }

  let object = parent[name];
  let fileList = null;
  if (object == null) {
    fileList = [];
  }
  else if (!field.allowMulti) {
    fileList = [object];
  } else {
    fileList = object;
  }

  const uploadButton = (
    <Button>
      <Icon type='plus' /><FormattedMessage id='upload' defaultMessage='上传'/>
    </Button>
  );

  return (
    <div>
      <Upload action={Urls.api_v1_storage.data_content_file}
        name='files[]' data={{ type:'file' }}
        onChange={handleChange} fileList={fileList}>
        {(!field.allowMulti && fileList.length > 0) ? null : uploadButton}
      </Upload>
    </div>
  )
};

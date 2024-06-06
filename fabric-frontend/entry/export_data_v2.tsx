import React, { FC, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {Col, Modal, Row, Radio, notification, Form, Button} from 'antd';


import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Container } from '../components/layout/Container';
import { FormPage } from '../components/layout/FormPage';
import { MgeLayout } from '../components/layout/MgeLayout';
import { MenuKey } from '../components/layout/NavMenu';

import { ConfigView, Config } from '../components/export/ConfigView';
import { CartView } from '../components/export/CartView';
import { SavedSearchListView } from '../components/export/SavedSearchListView';
import { AddOnChangeListener, RemoveOnChangeListener, GetAllSavedResult } from '../utils/SavedSearch';
import {ExportData2, ExportDataResult, ExportSJG} from '../apis/export/ExportData';
import { Export } from '../apis/define/Export';
import {MgeError} from '../apis/Fetch';

const ExportDataEntry: FC = () => {
  // 导出来源：搜索/单个数据
  const [srcType, setSrcType] = useState<'data' | 'search'>('data');
  // 购物车的状态
  const [cartSelected, setCartSelected] = useState<number[]>([]);
  const [single, setSingle] = useState(false);
  const [templateID, setTemplateID] = useState<number | null>(null)
  // 搜索结果列表的状态
  const [searchSelMode, setSearchSelMode] = useState<'data' | 'template'> ('data');
  const [searchSelID, setSearchSelID] = useState<number | null>(null);
  const [searchSelDataList, setSearchSelDataList] = useState<number[]>([]);
  const [searchSelTemplate, setSearchSelTemplate] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<any>(<div></div>);

  const handleExport = (config: Config) => {
    setLoading(true);
    const handleResult = (result: ExportDataResult) => {
      const content = result.async ? (
          <div>
            <a href={`/task`}>
              <FormattedMessage id='export:task' defaultMessage='导出任务已添加，去任务页面查看进度'/>
            </a>
          </div>
      ) : (
          <div>
            <a href={result.result}><FormattedMessage id='export:task' defaultMessage='导出完成，点此下载' /></a>
          </div>
      );
      setModalContent(content);
      setModalVisible(true);
      setLoading(false);

    };

    if (srcType === 'data') {
      // 旧版导出
      if (cartSelected.length === 0) {
        return;
      }
      
      // 整体导出
      ExportData2({
        fields: config.isPartial ? config.fieldPath : undefined,
        toOCPMDM: config.target === Export.Target.OCPMDM,
        dataIDs: cartSelected,
        format: config.fileType,
        flat: config.isFlat,
      }).then(handleResult).catch(()=>{setLoading(false)})
    }
    else {
      // TODO 新版
      if (searchSelMode === 'data') {
        if (searchSelDataList.length === 0) return;
        ExportData2({
          fields: config.isPartial ? config.fieldPath : undefined,
          toOCPMDM: config.target === Export.Target.OCPMDM,
          dataIDs: searchSelDataList,
          format: config.fileType,
          flat: config.isFlat,      // 2021/8/4修改，不知为何searchSelMode === 'data'的情况下要写死成false，已改回
        }).then(handleResult).catch(()=>{setLoading(false)})
      }
      else {
        ExportData2({
          fields: config.isPartial ? config.fieldPath : undefined,
          toOCPMDM: config.target === Export.Target.OCPMDM,
          dataIDs: searchSelDataList,
          format: config.fileType,
          flat: config.isFlat,
          query_id: searchSelID,
          tid: searchSelTemplate,
        }).then(handleResult).catch(()=>{setLoading(false)})
      }
    }
  }

  const handleSJGExport = () => {

    if (srcType === 'data') {
      // 旧版导出
      if (cartSelected.length === 0) {
          notification.error(({
          message: '数据为空，请先选择数据',
        }))
        return;
      }
      // 整体导出
      ExportSJG(cartSelected).catch((reason: MgeError) => {
        notification.error({
          message: reason.message,
        })
      })
    }
    else if (searchSelDataList.length === 0)
    {
      notification.error(({
        message: '数据为空，请先选择数据',
      }))
      return;
    }
    else {
      ExportSJG(searchSelDataList).catch((reason: MgeError) => {
        notification.error({
          message: reason.message,
        })
      })
    }
  }

  const handleCartUpdate = (selected: number[], single: boolean, tid: number | null) => {
    setCartSelected(selected);
    setSingle(single);
    setTemplateID(tid);
  }

  const handleSearchListUpdate = (mode: typeof searchSelMode, selID: number | null, dataList: number[], template: number | null) => {
    setSearchSelMode(mode);
    setSearchSelID(selID);
    setSearchSelDataList(dataList);
    setSearchSelTemplate(template);
  }

  useEffect(() => {
    const listener = () => {
      const all = GetAllSavedResult();
      for (let i of all) {
        if (i.id === searchSelID) {
          return;
        }
      }
      setSearchSelID(null);
      setSearchSelMode('data');
      setSearchSelDataList([]);
      setSearchSelTemplate(null);
    }

    AddOnChangeListener(listener);
    return () => {
      RemoveOnChangeListener(listener);
    }
  })

  const handleModeChange = (newMode: typeof srcType) => {
    setSrcType(newMode);
  }
  return (
    <MgeLayout loginRequired={true} reloadOnSwitchLocale selectedMenu={MenuKey.Export}>
      <Breadcrumb items={[
        Breadcrumb.MGED,
        Breadcrumb.MDB,
        Breadcrumb.DataExport]} />
      <Container>
        <FormPage
          style={{ display: 'flex', flexDirection: 'column' }}
          title={<FormattedMessage id='export:data' defaultMessage='数据导出' />}>
          <Row style={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
            <Col span={12} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ textAlign: 'center', margin: '8px 0' }}>
                <Radio.Group buttonStyle='solid' value={srcType} onChange={(e) => handleModeChange(e.target.value)}>
                  <Radio.Button value={'data'}><FormattedMessage id='data' defaultMessage='数据'/> </Radio.Button>
                  <Radio.Button value={'search'}><FormattedMessage id='search:result' defaultMessage='搜索结果'/></Radio.Button>
                </Radio.Group>
              </div>
              <div>
                {srcType === 'data' ?
                  <CartView selected={cartSelected}
                    update={handleCartUpdate}
                  /> : <SavedSearchListView
                        update={handleSearchListUpdate}
                        mode={searchSelMode}
                        selected={searchSelID}
                        dataList={searchSelDataList}
                        template={searchSelTemplate}
                        />}
              </div>
            </Col>
            <Col span={12} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <ConfigView 
                onExportClick={handleExport} 
                singleTemplate={srcType === 'data' ? single : (searchSelTemplate !==null)} 
                loading={loading}
                onSjgClick={handleSJGExport}
                templateID={srcType === 'data' ? templateID : searchSelTemplate} />
            </Col>
          </Row>
        </FormPage>
      </Container>
      <Modal
          title = {<FormattedMessage id='export:success' defaultMessage='导出成功' />}
          visible={modalVisible}
          footer={[
              <Button onClick={() => {setModalVisible(false);}}><FormattedMessage id='ok' defaultMessage='确认'/></Button>,
          ]}
      >
        {modalContent}
      </Modal>
    </MgeLayout>
  );
}


ReactDOM.render(<ExportDataEntry />, document.getElementById('wrap'));

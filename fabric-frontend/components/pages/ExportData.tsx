import React, { FC } from 'react';
import { Col, Divider, Row, Button } from 'antd';
import { FormattedMessage } from 'react-intl';

export const ExportData: FC = (props) => {

  

  return (
    <>
      <Row>
        <Col style={{ padding: '0 4px' }} span={12}>
          <Divider orientation='left'>选取数据</Divider>
        </Col>
        <Col style={{ padding: '0 4px' }} span={12}>
          <Divider orientation='left'>配置参数</Divider>
        </Col>
      </Row>
      <Divider />
      <div style={{textAlign: 'center', margin: '12px 0'}}>
        <Button style={{width: '120px'}} size='large' type='primary'>
          <FormattedMessage id='export' defaultMessage='导出' />
        </Button>
      </div>
    </>
  )
}
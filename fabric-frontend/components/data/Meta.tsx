import React, {FC, useEffect} from 'react';
import { Row, Col, Checkbox, Select } from 'antd';
import { FormattedMessage } from 'react-intl';

import { Title } from './fields/common/Title';
import { StringInputFieldContent } from './fields/content/String';
import { EditableTagGroup } from './fields/common/EditableTagGroup';
import { ProjectSelect } from './fields/ProjectSelect';
import { SubjectSelect } from './fields/SubjectSelect';
import { PublicRangeSelect } from './fields/PublicRangeSelect';
import { RangeSelect } from './fields/RangeSelect';
import { Data } from '../../apis/define/Data';
import { FieldType } from '../../apis/define/FieldType';

export interface Props {
  meta: any;
  informUpdate: () => void;
  is_edit?: boolean;
}

export const Meta: FC<Props> = ({ meta, informUpdate, is_edit }) => {

  const handleTagsChange = (tags: string[]) => {
    meta.keywords = tags;
    informUpdate();
  }

  const handleSourceChange = (source: Data.Source) => {
    meta.source = source;
    informUpdate();
  }

  const handleMethodsChange = (value: Data.Method, checked: boolean) => {
    if (checked) {
      meta.methods.add(value);
    }
    else {
      meta.methods.delete(value);
    }
    informUpdate();
  }

  const hanleProjectChange =(value: string) => {
    meta.project = value;
    informUpdate();
  }
  const handleSubjectChange = (value: string) => {
    meta.subject = value;
    informUpdate();
  }
  const hanlePublicRangeChange =(value: string) => {
    meta.public_range = Number(value.split("")[0]);
    meta.public_date = Number(value.split("")[1]);
    informUpdate();
  }
  const handleRangeChange =(value: string) => {
    meta.range = value
    informUpdate();
  }
  useEffect(() => {
    let temp = meta.methods;
    if (temp.has('computation')){
      temp.delete('computation');
      temp.add(Data.Method.Calculation);
    }
    if (temp.has('experiment')){
      temp.delete('experiment');
      temp.add(Data.Method.Experiment);
    }
    if (temp.has('production')){
      temp.delete('production');
      temp.add(Data.Method.Production);
    }
    if (temp.has('other')){
      temp.delete('other');
      temp.add(Data.Method.Other);
    }
    meta.methods = temp;
  }, [meta]);

  return (
    <>
      <Title name={<FormattedMessage id='data:title' defaultMessage='标题' />} extra='*' />
      <StringInputFieldContent 
        field={{type: FieldType.String, title: 'title', required: false}}
        name='title' parent={meta} informUpdate={informUpdate} />

      <Title name={<FormattedMessage id='data:abstract' defaultMessage='摘要' />} extra='*' />
      <StringInputFieldContent 
        field={{type: FieldType.String, title: 'abstract', required: false}}
        name='abstract' parent={meta} informUpdate={informUpdate} />

      <Row>
        <Col span={12} style={{ paddingRight: '8px' }}>
          <Title name='DOI' />
          <StringInputFieldContent 
            field={{type: FieldType.String, title: 'doi', required: false}}
            name='doi' parent={meta} informUpdate={informUpdate} />
        </Col>
        <Col span={12}>
          <Title name={<FormattedMessage id='data:keywords' defaultMessage='关键词' />} extra='*' />
          <div>
            <EditableTagGroup size='small' tags={meta.keywords} onTagsChange={handleTagsChange} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12} style={{ paddingRight: '8px' }}>
          <Title name={<FormattedMessage id='data:source' defaultMessage='来源' />} extra='*'/>
          <div>
            <Select value={meta.source} onChange={handleSourceChange} style={{ width: '100%', display: 'block' }}>
              <Select.Option value={Data.Source.SelfProduct}>
                <FormattedMessage id='data:self_product' defaultMessage='自产' />
              </Select.Option>
              <Select.Option value={Data.Source.Extract}>
                <FormattedMessage id='data:extract' defaultMessage='摘录' />
              </Select.Option>
            </Select>

          </div>
        </Col>
        <Col span={12} >
          <Title name={<FormattedMessage id='data:reference' defaultMessage='引用' />}
            extra={meta.source === Data.Source.Extract ? '*' : undefined} />
          <StringInputFieldContent name='reference' parent={meta} informUpdate={informUpdate} 
            field={{type: FieldType.String, title: 'reference', required: meta.source === Data.Source.Extract}}/>
          <FormattedMessage id='data:reference_required' defaultMessage='数据来源为「摘录」时引用为必填' />
        </Col>
      </Row>
      <Row>
        <Col span={12} style={{ paddingRight: '8px' }}>
          <Title name={<FormattedMessage id='data:producer' defaultMessage='数据生产者' />} />
          <StringInputFieldContent
            field={{ type: FieldType.String, title: 'contributor', required: false }}
            name='contributor' parent={meta} informUpdate={informUpdate} />
        </Col>
        <Col span={12}>
        <Title name={<FormattedMessage id='data:producer_org' defaultMessage='数据生产机构' />} />
          <StringInputFieldContent 
            field={{type: FieldType.String, title: 'institution', required: false}}
            name='institution' parent={meta} informUpdate={informUpdate} />
        </Col>
      </Row>
      <Row>
        <Col span={12} style={{ paddingRight: '8px' }}>
          <Title name={<FormattedMessage id='data:method' defaultMessage='方法' />} extra='*'/>
          <div style={{ lineHeight: '32px' }}>
            <Checkbox
              // checked={meta.methods.has(Data.Method.Calculation)}
              checked={meta.methods.has('computation') || meta.methods.has(Data.Method.Calculation)}
              onChange={(e) => handleMethodsChange(Data.Method.Calculation, e.target.checked)}>
              <FormattedMessage id='data:calculation' defaultMessage='计算' />
            </Checkbox>
            <Checkbox
              // checked={meta.methods.has(Data.Method.Experiment)}
              checked={meta.methods.has('experiment') || meta.methods.has(Data.Method.Experiment)}
              onChange={(e) => handleMethodsChange(Data.Method.Experiment, e.target.checked)}>
              <FormattedMessage id='data:experiment' defaultMessage='实验' />
            </Checkbox>
            <Checkbox
              // checked={meta.methods.has(Data.Method.Production)}
              checked={meta.methods.has('production') || meta.methods.has(Data.Method.Production)}
              onChange={(e) => handleMethodsChange(Data.Method.Production, e.target.checked)}>
              <FormattedMessage id='data:extract' defaultMessage='生产' />
            </Checkbox>
            <Checkbox
              // checked={meta.methods.has(Data.Method.Other)}
              checked={meta.methods.has('other') || meta.methods.has(Data.Method.Other)}
              onChange={(e) => handleMethodsChange(Data.Method.Other, e.target.checked)}>
              <FormattedMessage id='data:other' defaultMessage='其他' />
            </Checkbox>
          </div>
        </Col>
      </Row>
      {/* <Row>
        <Col span={24}>
          <Title name={<FormattedMessage id='data:project' defaultMessage='项目' />} extra={'*'} />
          <ProjectSelect style={{ width: '100%' }} value={meta.project} onChange={hanleProjectChange} />
        </Col>

      </Row>
      <Row>
        <Col span={24}>
          <Title name={<FormattedMessage id='data:subject' defaultMessage='课题' />} extra={'*'} />
          <SubjectSelect style={{ width: '100%' }} value={meta.subject} onChange={handleSubjectChange} projectID={meta.project} />
        </Col>
      </Row> */}
      <Row>
        <Col span={24}>
          <Title name={<FormattedMessage id='data:public_time_range' defaultMessage='数据公开时间范围' />} extra={'*'} />
          <PublicRangeSelect style={{ width: '100%' }}
                              is_edit={is_edit === true}
                             value={'' + meta.public_range + meta.public_date} onChange={hanlePublicRangeChange} />
        </Col>
      </Row>
      <Row>
        {/*<Col span={24} style={meta.public_range === 0 ? {}:{display: 'none'} }>*/}
        {/*  <Title name={<FormattedMessage id='data:public_range' defaultMessage='数据公开范围' />}  extra={'*'} />*/}
        {/*  <RangeSelect style={{ width: '100%' }} value = {meta.range}*/}
        {/*                      is_edit={is_edit === true} onChange={handleRangeChange} />*/}
        {/*</Col>*/}
      </Row>
    </>
  )
}

import React, { FC, useEffect, useState } from 'react';
import { SavedSearchItem, RemoveSearchResult } from '../../utils/SavedSearch';
import { Checkbox, Radio } from 'antd';
import Urls from '../../apis/Urls';
import { GetQueryDownload, QueryDownload } from '../../apis/search/v2/Query';
import { FlexLoading } from '../common/FlexLoading';
import { RadioChangeEvent } from 'antd/lib/radio';
import {FormattedMessage} from "react-intl";
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

export interface SearchItemProps {
  value: SavedSearchItem;
  selected: boolean;
  selectedTemplate: number | null;
  selectedDataList: number[];
  onClick: () => void;
  update: (mode: 'data' | 'template', dataList: number[], template: number | null) => void;
}

const radioStyle: React.CSSProperties = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

export const SearchItem: FC<SearchItemProps> = (props) => {

  const [download, setDownload] = useState<QueryDownload | null>(null);

  useEffect(() => {
    GetQueryDownload(props.value.id).then((value) => {
      setDownload(value);
    })
  }, [])

  const borderColor = props.selected ? '#1890ff' : '#E9E9E9';
  const handleButtonClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
  }

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    RemoveSearchResult(props.value.id);
  }

  const handleRadioChange = (e: RadioChangeEvent) => {
    e.stopPropagation();
    props.update('template', [], e.target.value);
  }

  
    const handleCheckboxChange = (id: number, value: boolean, t: number) => {
        const s = new Set(props.selectedDataList);
        if (value) s.add(id); else s.delete(id);
        const templates = new Set<number>([]);
        for(let i of download.download.data.include) {
          if (s.has(i.id)) {
            templates.add(i.template);
          }
        }
        if (templates.size > 1) {
          props.update('data', Array.from(s), null);
        }
        else {
          props.update('data', Array.from(s), Array.from(templates)[0]);
        }
      }
    

  return (
    <div style={{ margin: '8px 0', padding: '8px', border: `2px solid ${borderColor}`, borderRadius: '4px', cursor: 'pointer', position: 'relative' }} >
      <div onClick={props.onClick}>
      <span style={{ fontWeight: 'bold' }}><FormattedMessage id='data:keywords' defaultMessage='关键词'/> </span>：{props.value.value}
      <a style={{ float: 'right', color: 'red', marginLeft: '8px' }}
        href='javascript:void(0)'
        onClick={handleDelete}><FormattedMessage id={'dash:delete'} defaultMessage='删除' /></a>
      <a style={{ float: 'right' }} target='_blank'
        href={`${Urls.search.index}#/${props.value.id}/`}
        onClick={handleButtonClick}><FormattedMessage id='export:view' defaultMessage='查看' /></a>
      </div>
      <div style={{ height: props.selected ?  'auto' : '0', transition: 'height 0.3s ease-in-out', overflow: 'hidden' }}>
        {props.selected ? (
          <div>
            {download == null ? <FlexLoading /> : (
              <div>
                <FormattedMessage id={'data'} defaultMessage='数据'/>
                <div>
                  {download.download.data.include.map(value => (
                    <Checkbox onChange={e => handleCheckboxChange(value.id, e.target.checked, value.template)}
                      key={value.id} style={{display: 'block', marginLeft: 0}} 
                      checked={props.selectedDataList.includes(value.id)}>{value.title}/{value.id}</Checkbox>
                  ))}
                </div>
                <FormattedMessage id={'template'} defaultMessage='模板' />
                <div>
                  <Radio.Group value={props.selectedTemplate} onChange={handleRadioChange}>
                  {download.download.template.include.map(value => (
                    <Radio style={radioStyle} key={value.id} value={value.id}>
                      {value.title}
                    </Radio>
                  ))}
                  </Radio.Group>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

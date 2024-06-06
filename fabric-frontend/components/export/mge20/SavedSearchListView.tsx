import React, { FC, useEffect, useState } from 'react';
import { GetAllSavedResult, SavedSearchItem, AddOnChangeListener, RemoveOnChangeListener, RemoveSearchResult } from '../../../utils/SavedSearch';
import Urls from '../../../apis/Urls';

import { SearchItem } from './SearchItem';

export interface Props {
  // 当前选中的搜索结果
  selected: number | null;
  template: number | null;
  dataList: number[];
  mode: 'data' | 'template';
  update: (mode: 'data' | 'template', selID: number | null, dataList: number[], template: number | null) => void;
}

export const SavedSearchListView: FC<Props> = (props) => {

  const [list, setList] = useState<SavedSearchItem[]>([]);

  const handleClick = (id: number) => {
    props.update('data', id, [], null);
  }

  useEffect(() => {
    setList(GetAllSavedResult());
  }, [])

  useEffect(() => {
    const listener = () => {
      setList(GetAllSavedResult());
    }

    AddOnChangeListener(listener);
    return () => {
      RemoveOnChangeListener(listener);
    }
  })

  const handleUpdate = (mode: 'data' | 'template', dataList: number[], template: number | null) => {
    props.update(mode, props.selected, dataList, template);
  }

  return (
    <div style={{ margin: '16px' }}>
      {list.length !== 0 ? null : (
        <div style={{ textAlign: 'center' }}>
          去<a href={'/search_20'}>搜索</a>页面添加更多数据
                </div>
      )}
      {list.map((value) => {
        return (
          <SearchItem key={value.id}
            update={value.id === props.selected ? handleUpdate : () => {}}
            selectedTemplate={value.id === props.selected ? props.template : null}
            selectedDataList={value.id === props.selected ? props.dataList : []}
            onClick={() => handleClick(value.id)}
            value={value} selected={props.selected === value.id} />
        )
      })}
    </div>
  )
}

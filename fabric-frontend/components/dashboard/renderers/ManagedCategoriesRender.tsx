import React, { FC } from 'react';
import { Category } from '../../../apis/define/Category';

export interface Props {
  categoryies: Category.Base[];
}

export const ManagedCategoriesRender: FC<Props> = (props) => {
  return (
    <div style={{
      border: '1px solid #CCC', borderRadius: '4px',
      overflowY: 'scroll',
      padding: '0 16px', maxHeight: '320px'
    }}>
      {props.categoryies.length === 0 ? '无' : null }
      {
        props.categoryies.map((value) => {
          return (
            <div key={value.id}>{value.name}</div>
          )
        })
      }
    </div>
  )
}
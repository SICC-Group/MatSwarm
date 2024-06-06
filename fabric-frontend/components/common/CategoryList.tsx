import React, { FC, useState, useEffect } from 'react';
import { Tree } from 'antd';

import { GetCategory } from '../../apis/category/Get';
import { Category } from '../../apis/define/Category';
import { FlexLoading } from './FlexLoading';


export interface Props {
  value: number[];
  onChange: (newList: number[]) => void;
}

function FindCategory(id: number, list: Category[]): Category {
  for (let i of list) {
    if (i.id === id) {
      return i;
    }
    else if (i.children.length !== 0) {
      const result = FindCategory(id, i.children);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

function GetLeafOf(category: Category): Category[] {
  const set = new Set<Category>();
  for (let i of category.children) {
    if (i.children.length === 0) set.add(i);
    else {
      const children = GetLeafOf(i);
      for (let child of children) set.add(child);
    }
  }
  return Array.from(set);
}

export const CategoryList: FC<Props> = (props) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Category[]>([]);

  useEffect(() => {
    setLoading(true);
    GetCategory().then((value) => {
      setLoading(false);
      setList(value);
    });
  }, []);

  const handleOnCheck = (checkedKeys: string[]) => {
    const keys = checkedKeys.map(i => Number(i));
    const result: Category[] = [];
    for (let i of keys) {
      const category = FindCategory(i, list);
      if (category.children.length !== 0) {
        result.concat(...GetLeafOf(category));
      }
      else {
        result.push(category);
      }
    }
    console.log(result.map(x => x.id));
    props.onChange(result.map(x => x.id));
  }

  const checkedKeys = props.value.map(x => String(x));

  const treeRender = (data: Category[]) => {
    return data.map(value => {
      if (value.children.length !== 0) {
        return (
          <Tree.TreeNode title={value.name} expanded key={String(value.id)} dataRef={value}>
            {treeRender(value.children)}
          </Tree.TreeNode>
        )
      }
      else {
        return <Tree.TreeNode title={value.name} expanded key={String(value.id)} dataRef={value} />
      }
    })
  }

  return (
    <div>
      {loading ? <FlexLoading /> : (
        <Tree checkable selectable={false}
          onCheck={handleOnCheck} checkedKeys={checkedKeys}>
          {treeRender(list)}
        </Tree>
      )
      }
    </div>
  )
}

import React, { FC, useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import { FormattedMessage } from 'react-intl';
import { GetCategory } from '../../apis/category/Get';
import { Category } from '../../apis/define/Category';
import { UserRole } from '../../apis/define/User';
import { Info } from '../../apis/session/Info';
const TreeNode = TreeSelect.TreeNode;

interface Props {
  value: number | undefined;
  onChange: (newValue: number) => void;
  className?: string;
  style?: React.CSSProperties;
  disable?: boolean;
  setName?: (label: string) => void
}
function PathnameToState(pathname: string): number {
  if (pathname.startsWith('/storage/template/new')) { //模板创建页面
      return 0;
  }
  else {
      return -1; //数据创建页面
  }
}
export const CategoryTree: FC<Props> = (props) => {
  const [tree, setTree] = useState<Category[]>([]);
  const currentStates = PathnameToState(window.location.pathname);
  useEffect(() => {
    Info().then(result => {
      GetCategory().then((value) => {
        if ((!result.roles.includes(UserRole.UserAdmin)) && currentStates === 0) {//模板创建页面 非超级管理员用户不可使用科研成果分类
          for(let i in value){
            if (value[i].name === '科研成果') { 
              value.splice(Number(i), 1);
              break;
            }
          }
          setTree(value)
        } else {
          setTree(value)//数据创建页面以及超级管理员在创建模板时可以使用科研成果分类
        }
      })
    })
  }, []);

  const CategoryToTreeNode = (category: Category) => {
    const isLeaf = category.children.length === 0;
    return (
      <TreeNode value={category.id} title={category.name} key={category.id} disabled={!isLeaf} selectable={isLeaf}>
        {isLeaf ? undefined : category.children.map(CategoryToTreeNode)}
      </TreeNode>
    );
  };

  return (
    <TreeSelect
      disabled={props.disable}
      className={props.className} style={props.style}
      value={props.value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder={<FormattedMessage id='template:select_category' defaultMessage='请选择分类' />}
      allowClear
      treeDefaultExpandAll
      onChange={(value, label) => {
        props.onChange(value);
        props.setName && props.setName(label);
      }}
      showSearch
      treeNodeFilterProp='title'
    >
      {tree.map(CategoryToTreeNode)}
    </TreeSelect>
  );
};

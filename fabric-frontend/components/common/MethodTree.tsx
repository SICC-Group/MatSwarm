import React, { FC, useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import { FormattedMessage } from 'react-intl';

import { GetTemplateMethodTree, MaterialMethod } from '../../apis/template/GetTemplateMethod';

const TreeNode = TreeSelect.TreeNode;

interface Props {
  value: number | undefined;
  onChange: (newValue: number | undefined) => void;
  className?: string;
  style?: React.CSSProperties;
  disable?: boolean;
  category?: number | undefined;
}

export const MethodTree: FC<Props> = (props) => {

  const [tree, setTree] = useState<MaterialMethod[]>([]);

  useEffect(() => {
    GetTemplateMethodTree().then(value => {
      setTree(value);
    })
  }, []);

  const methodToTreeNode = (method: MaterialMethod) => {
    const isLeaf = method.children.length === 0;
    if (props.category === 101) {       // 科研成果对应id为101，如后端修改需要更新
      if (method.name === '其他') {
        return (
            <TreeNode value={method.id} title={method.name} key={method.id} disabled={!isLeaf} selectable={isLeaf}>
              {isLeaf ? undefined : method.children.map(methodToTreeNode)}
            </TreeNode>
        );
      } else {
        return <div></div>
      }
    }

    else {
      return (
      <TreeNode value={method.id} title={method.name} key={method.id} disabled={!isLeaf} selectable={isLeaf}>
        {isLeaf ? undefined : method.children.map(methodToTreeNode) }
      </TreeNode>
    ); }
  };

  return (
    <TreeSelect
      disabled={props.disable}
      className={props.className} style={props.style}
      value={props.value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder={<FormattedMessage id='template:select_method' defaultMessage='请选择数据产生方式' />}
      allowClear
      treeDefaultExpandAll
      onChange={props.onChange}
      showSearch
      treeNodeFilterProp='title'
    >
      {tree.map(methodToTreeNode)}
    </TreeSelect>
  );
};

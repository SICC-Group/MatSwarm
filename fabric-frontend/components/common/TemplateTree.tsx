import React, { FC, useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import { FormattedMessage } from 'react-intl';

import { Template } from '../../apis/define/Template';
import { GetTemplateByCatetoryID } from '../../apis/template/GetTemplateByCategoryID';


const TreeNode = TreeSelect.TreeNode;

interface Props {
  value: number | undefined;
  onChange: (newValue: number) => void;
  className?: string;
  style?: React.CSSProperties;
  categoryID: number;
  methodID: number;
}

export const TemplateTree: FC<Props> = (props) => {

  const [tree, setTree] = useState<Template.Info[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    GetTemplateByCatetoryID(2, 4).then((value) => {
      setTree(value.templates);
      setLoading(false);
    });
  }, [props.categoryID, props.methodID]);

  const TemplateToTreeNode = (template: Template.Info) => {
    return (
      <TreeNode value={template.id} title={template.title} key={template.id} selectable={true}/>
    );
  };

  if (loading === false && tree.length === 0) {
      return <FormattedMessage id='data:no_template' defaultMessage='该分类下没有模板'/>
  }

  return (
    <TreeSelect loading={loading}
      className={props.className} style={props.style}
      value={props.value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder={<FormattedMessage id='data:select_template' defaultMessage='请选择模板' />}
      allowClear
      treeDefaultExpandAll
      onChange={props.onChange}
                showSearch
                treeNodeFilterProp='title'
    >
      {tree.map(TemplateToTreeNode)}
    </TreeSelect>
  );
};

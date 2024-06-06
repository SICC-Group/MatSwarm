import React, { Component } from 'react';
import { Tree } from 'antd';

import { GetProjectList } from '../../apis/project/ProjectAnalytics';
import { GetSpecificProject } from '../../apis/project/GetSpecificProject';

import { AntTreeNode, AntTreeNodeSelectedEvent } from 'antd/lib/tree';

export interface ProjectTreeProps {
  display: string;
  onClick?: (key: string, name?: string) => void;
  selected?: string;
  style?: React.CSSProperties;
  className?: string;
}
interface Node {
  title: string,
  key: string,
  children?: Node[],
  isLeaf?: boolean,
}
interface State {
  data: Node[];
}

const { TreeNode } = Tree;

export class ProjectTree extends Component<ProjectTreeProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    var tree: Node[] = []
    GetProjectList().then((value) => {
      value.map(item => {
        tree.push({ title: item.id, key: item.name });
      });
      this.setState({ data: tree })
    });
  }

  onLoadData = (treeNode: AntTreeNode) =>
    new Promise<void>(resolve => {
      var childern: any[] = []
      if (treeNode.props.children === []) {
        resolve();
        return;
      }
      GetSpecificProject((treeNode.props.dataRef.title)).then((value) => {
        value.subjects.map(item => {
          childern.push({ title: item.id, key: item.name, isLeaf: true });
        });
        treeNode.props.dataRef.children = childern;
        this.setState({
          data: [...this.state.data],
        });
        resolve();
      });
    });

  renderTreeNodes = (data: Node[]) =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={<div style={{ color: '#fff' }}>{this.props.display == 'name' ? item.key : item.title}</div>} key={item.key}  dataRef={item} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={<div style={{ color: '#fff' }}>{this.props.display == 'name' ? item.key : item.title}</div>} isLeaf={item.isLeaf} dataRef={item} />;
    });

  selectNode = (key: string[], e: AntTreeNodeSelectedEvent) => {
    this.props.onClick(e.node.props.dataRef.title, e.node.props.eventKey);
  }

  render() {
    return <Tree className='tree-wrapper' loadData={this.onLoadData} onSelect={this.selectNode} style={{ color: '#fff' }}>{this.renderTreeNodes(this.state.data)}</Tree>;
  }


}

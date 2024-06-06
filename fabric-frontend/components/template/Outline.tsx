import React, { Component } from 'react';
import { FieldType } from '../../apis/define/FieldType';
import { AnyField, ContainerField, TableField, GeneratorField } from '../../apis/define/Field';
import './Outline.less';

import { Tree } from 'antd';
import { autobind } from 'core-decorators';

export interface OutlineProps {
  template: any[];
  selected: string;
  onClick: (fieldPath: string) => void;
  updateTemplate?:(template: any[]) =>void;
  draggable:boolean;
}

interface State {
  showData: boolean;
  data: any[];
  expandedKeys: string[];
  autoExpandParent: boolean
}

export class Outline extends Component<OutlineProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      showData: true,
      data:[],
      expandedKeys:[],
      autoExpandParent:true,
    };
  }

  componentWillReceiveProps(nextProps: OutlineProps) {
      this.setState({
        data: this.ChangeForm(nextProps.template),
      })
  }

  @autobind
  showClick() {
    this.setState((prevState) => ({
      showData: !prevState.showData,
    }));
  }

  ChangeForm(treeData: any[], index_path?: string) {
    let exkeys :string[]=[]
    treeData.forEach((item: any, index: number) => {
      if (item.children) {
        const parentindex = index_path ? (index_path + '-' + String(index)) : String(index)
        item.children = this.ChangeForm(item.children, parentindex);
      }
    item.key = index_path ? (index_path + '-' + String(index)) : String(index);
    if(item.children){exkeys.push(item.key)}
    this.setState({
      expandedKeys:exkeys
    })
    });
    return treeData;
  }

  treeRender = (data: any[]) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode title={((item.title==='')?'<无标题>':item.title)+((item.required)?'*':'')} key={item.key} expanded dataRef={item}>
            {this.treeRender(item.children)}
          </Tree.TreeNode>
        )
      }
      else {
        return <Tree.TreeNode title={((item.title==='')?'<无标题>':item.title)+((item.required)?'*':'')} key={item.key} dataRef={item}/>
      }
    })
  }


  onDragEnter = (info: any) => {
    console.log(info);
    //expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  onDrop = (info: any) => {
    console.log(info);
    const dropKey = info.node.props.eventKey; //拖拽落下的值
    const dragKey = info.dragNode.props.eventKey;//被拖拽的值
    const dropPos = info.node.props.pos.split('-'); //拖拽落下的位置 最外层到最里层
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: any[], key: number, callback: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    const gettype = (data:any[],key:number[]) => {
      let type :number
      if(key.length = 2||3){type = data[key[1]].type}
      for(let i=1;i<key.length-1;i++){
          if(i = key.length-2){return data[i].type}
          data = data[key[i]].children
      }
      return type
    }

    const data = [...this.state.data];
    if(dropKey == 0 || dragKey == 0){return} //标识符字段不允许拖拽
    if (!info.dropToGap) {
      if((info.node.props.dataRef.type==7) //数组类型不能拖拽至content，防止渲染错误
      ||(!info.node.props.dataRef.children) //基本类型不能拖拽至centent
      ||(info.node.props.dataRef.type==8&&info.dragNode.props.dataRef.children)//表格类型不接受复合类型拖拽至content
      ||(info.node.props.dataRef.type==10&&info.dragNode.props.dataRef.type === 10)//生成器类型不接受生成器拖拽至content
      ){}else{
          let dragObj: any;
          loop(data, dragKey, (item:any, index:any, arr:any[]) => {
              arr.splice(index, 1);
              dragObj = item;
          });
          loop(data, dropKey, (item: { children: any[]; }) => {
              item.children = item.children || [];
              // where to insert 示例添加到尾部，可以是随意位置
              item.children.push(dragObj);
          });
      }
    } else { //拖拽至gap
      //console.log('type是',gettype(data,dropPos))
      if((info.dragNode.props.dataRef.children&&gettype(data,dropPos) === 8)
      ||(gettype(data,dropPos) === 7)
      ||(gettype(data,dropPos) === 10 && info.dragNode.props.dataRef.type == 10)
      ){} //拖拽限制 
      else{
      // Find dragObject
      let dragObj: any;
      loop(data, dragKey, (item: any, index: any, arr: any[]) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      if (
        (info.node.props.children || []).length > 0 && // Has children
        info.node.props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item: any) => {
          item.children = item.children || [];
          // where to insert 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj);
        });
      } else {
        let ar: any[];
        let i: number;
        loop(data, dropKey, (item: any, index: number, arr: []) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }}
    }
    this.props.updateTemplate(data)
  };

  onExpand = (expandedKeys: any) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  render() {
    return (
        <div>
          <Tree 
            // defaultExpandAll
            draggable={this.props.draggable}
            blockNode
            onDragEnter={this.onDragEnter}
            onDrop={this.onDrop}
            expandedKeys={this.state.expandedKeys}
            onExpand={this.onExpand}
            autoExpandParent={this.state.autoExpandParent}
          >
            {this.treeRender(this.state.data)}
          </Tree>
        {/* <div>
        {this.props.template.map((item, index) => {
          let title = item.title === '' ? <FormattedMessage id='template:empty_title' defaultMessage='<无标题>'/> : item.title;
          
          if (item.type === FieldType.Container) {
            return (
              <div key={index}><DataRead dataChildren={(item as ContainerField).children} required={item.required} title={title} isMain={true}/></div>
            )
          } else if (item.type === FieldType.Table) {
            return (
              <div key={index}><DataRead dataChildren={(item as TableField).children} required={item.required}title={title} isMain={true}/></div>
            )
          } else if (item.type === FieldType.Generator) {
            return (
              <div key={index}>
                <DataRead dataChildren={(item as GeneratorField).children} required={item.required} title={title} isMain={true}/>
              </div>
            )
          } else if (item.type === FieldType.Array) {
            if (item.children.length > 0 && FieldType.isComposite(item.children[0].type)) {
              return (
                <div key={index}>
                  <DataRead required={item.required} dataChildren={(item.children[0] as GeneratorField).children} title={title} isMain={true}/>
                </div> 
              )
            }
            else {
              return (
                <div key={index} className='TreeMain'>
                  {title}{item.required ? '*' : null}
                </div>
              )
            }
          } else {
            return (
              <div key={index} className='TreeMain'>
                {title}{item.required ? '*' : null}
              </div>
              // <Card
              //   key={index}
              //   id={`${index}`}
              //   text={title}
              //   moveCard={this.moveCard}
              // />
            )
          }
        })}
      </div> */}
      </div>
    );
  }
}

// interface DataReadProps {
//   dataChildren: AnyField[];
//   title: React.ReactNode;
//   isMain: boolean;
//   required: boolean;
// }
// interface DataReadState {
//   showData: boolean;
// }

// class DataRead extends React.Component<DataReadProps, DataReadState>{

//   constructor(props: DataReadProps) {
//     super(props);
//     this.state = {
//       showData: true,
//     }
//     this.showClick = this.showClick.bind(this);
//   }

//   showClick() {
//     this.setState((prevState) => ({
//       showData: !prevState.showData,
//     }));
//   }

//   render() {
//     return (
//       <div>
//         <div className={this.props.isMain ? 'TreeMain' : 'TreeBranch'}>
//           {this.props.title}{this.props.required ? '*' : null}
//           <i className={`fa fa-${this.state.showData ? 'caret-down' : 'caret-right'}`} onClick={this.showClick} />
//           {this.props.dataChildren.map((item, index) => {
//             let title = item.title === '' ? <FormattedMessage id='template:empty_title' defaultMessage='<无标题>' /> : item.title;
//             if (!this.state.showData) {
//               return (
//                 <div key={index} ></div>
//               )
//             } else if (item.type === FieldType.Table || item.type === FieldType.Container) {
//               return (
//                 <div key={index} className='ConnectingLine'><DataRead required={item.required} dataChildren={(item as ContainerField).children} title={title} isMain={false} /></div>
//               )
//             } else if (item.type === FieldType.Generator) {
//               return (
//                 <div key={index} className='ConnectingLine'>
//                   <DataRead required={item.required} dataChildren={(item as GeneratorField).children} title={title} isMain={false} />
//                 </div>
//               )
//             } else if (item.type === FieldType.Array) {
//               if (item.children.length > 0 && FieldType.isComposite(item.children[0].type)) {
//                 return (
//                   <div key={index} className='ConnectingLine'>
//                     <DataRead required={item.required} dataChildren={(item.children[0] as GeneratorField).children} title={title} isMain={false} />
//                   </div>
//                 )
//               }
//               else {
//                 return (
//                   <div key={index} className='ConnectingLine'>
//                     {title}{item.required ? '*' : null}
//                   </div>
//                 )
//               }
//             } else {
//               return (
//                 <div key={index} className='ConnectingLine'>{title}{item.required ? '*' : null}</div>
//               )
//             }
//           })}
//         </div>
//       </div>
//     );
//   }
// }

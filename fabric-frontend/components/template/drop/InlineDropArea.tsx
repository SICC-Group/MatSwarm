import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import './DropArea.less'

import { FieldPath } from '../context/TemplateCtrl';
import { ConnectDropTarget, DropTargetSpec, DropTargetCollector, DropTarget } from 'react-dnd';
import { DropResult } from '../fields/common/DropResult';
import { FieldType } from '../../../apis/define/FieldType';

const img = require('../../../img/drop-area.png');
const msg = <FormattedMessage id='template:drop_here' defaultMessage='将数据类型拖入此区域' />;
const msgclick = <FormattedMessage id='template:drop_here' defaultMessage='将数据类型拖入此区域(点击可导入模板片段)' />;
export interface InlineDropAreaProps {
  parent: FieldPath;
  index: number;
  large?: boolean
  forbidTypes?: FieldType[];
  onLoad?:()=>void;//导入模板片段
  container?:boolean;
}

export interface CollectedProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  canDrop: boolean;
  dragging: boolean;
}

type Props = InlineDropAreaProps & CollectedProps;

const spec: DropTargetSpec<Props> = {
  canDrop(props, monitor) {
    
    const item = monitor.getItem();
    if (item && props.forbidTypes) {
      if (props.forbidTypes.includes(item.type)) return false;
    }
    return true;
  },
  drop(props, monitor, component): DropResult {
    return {
      parent: props.parent,
      index: props.index,
    }
  }
}

const collect: DropTargetCollector<CollectedProps, InlineDropAreaProps> = (connect, monitor, props) => {
  return {
      dragging: monitor.getItem() !== null,
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
  };
}



const _InlineDropArea: FC<Props> = ({connectDropTarget, isOver, large, dragging,onLoad,container}) => {
  const borderStyle: React.CSSProperties = {
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'transparent',
  }
  if (isOver) {
    borderStyle.borderColor = '#ba68c8';
    borderStyle.backgroundColor = '#e1bee7';
  }
  else if (dragging) {
    borderStyle.borderColor = '#e1bee7';
    borderStyle.backgroundColor = '#e1bee7';
  }

  const url = window.location.href.split('/');
  var type:string = String(url[url.length-2]); 
  return connectDropTarget(
    <div style={large ? null : borderStyle} 
      className={`${large ? 'DropArea' : 'InlineDropArea'} ${isOver ? 'Hover' : ''}`} onClick={onLoad}>
      { large ? <img className='DropArea__icon' src={img} /> : null }
      { large ? (container? (type==='template'? msgclick:msg):msg ): null} 
    </div>
  );
}

export const InlineDropArea: React.ComponentType<InlineDropAreaProps> = DropTarget('box', spec, collect)(_InlineDropArea) as any;

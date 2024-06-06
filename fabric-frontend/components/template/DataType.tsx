import React, { Component, FC, ComponentType } from 'react';
import { ConnectDragSource, DragSourceSpec, DragSourceCollector, DragSource } from 'react-dnd';
import withStyles, { WithStyles } from 'react-jss';

import './DataType.less';
import { FieldType } from '../../apis/define/FieldType';
import { EditorContext } from './context/EditorContext';
import { DropResult } from './fields/common/DropResult';
import { TemplateCtrl } from './context/TemplateCtrl';
import { FormattedMessage } from 'react-intl';

const styles = {
  DataType: {
    height: '80px',
    width: '84px',
    marginRight: '8px',
    marginBottom: '4px',
    display: 'inline-block',
    position: 'relative',
  },
  Title : {
    color: 'white',
    fontSize: '13px',
    textAlign: 'center',
    background: 'rgb(22,143,184)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    lineHeight: '28px',
  }
}
interface DataTypeBlockProps {
  imgSrc: string;
  type: FieldType;
  control: TemplateCtrl;
  msgID: string;
}

interface CollectedProps {
  connectDragSource: ConnectDragSource;
  isDragging: boolean;
}

type Props = DataTypeBlockProps & CollectedProps;

const spec: DragSourceSpec<Props, {}> = {
  beginDrag(props, monitor) {
    return { type: props.type};
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }
    const result: DropResult = monitor.getDropResult();
    props.control.insert(result.parent, result.index, props.type);
  }
}

const collect: DragSourceCollector<CollectedProps, {}> = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

type StyledProps = Props & WithStyles<typeof styles>;


const _DataTypeBlock: FC<StyledProps> = (props) => {
  return props.connectDragSource(
    <div className={props.classes.DataType} style={{ backgroundImage: `url(${props.imgSrc})` }}>
      <div className={props.classes.Title}>
        <FormattedMessage id={props.msgID}/>
      </div>
    </div>
  );
};

const DataTypeBlock: ComponentType<DataTypeBlockProps> = withStyles(styles)(DragSource('box', spec, collect)(_DataTypeBlock)) as any;


const primitiveGroup = [
  { img: require('../../img/type1.png'), type: FieldType.String, msgID: 'type_string' },
  { img: require('../../img/type2.png'), type: FieldType.Number, msgID: 'type_number' },
  { img: require('../../img/type3.png'), type: FieldType.Range, msgID: 'type_range' },
  { img: require('../../img/type4.png'), type: FieldType.Choice, msgID: 'type_choice' },
];

const fileGroup = [
  { img: require('../../img/type5.png'), type: FieldType.Image, msgID: 'type_image' },
  { img: require('../../img/type6.png'), type: FieldType.File, msgID: 'type_file' },
];

const compositeGroup = [
  { img: require('../../img/type7.png'), type: FieldType.Array, msgID: 'type_array' },
  { img: require('../../img/type8.png'), type: FieldType.Table, msgID: 'type_table' },
  { img: require('../../img/type9.png'), type: FieldType.Container, msgID: 'type_container' },
  { img: require('../../img/type10.png'), type: FieldType.Generator, msgID: 'type_generator' },
]

export class TemplateDataType extends Component {
  render() {
    return (
      <EditorContext.Consumer>
        {(context) => {
          return (
            <div className='DataTypeWrapper'>
              <div className='SubGroup'>
                {
                  primitiveGroup.map((value, index) => (
                    <DataTypeBlock key={index} control={context.templateCtrl} 
                      msgID={value.msgID}
                      imgSrc={value.img} type={value.type} />
                  ))
                }
              </div>
              <div className='SubGroup'>
                {
                  fileGroup.map((value, index) => (
                    <DataTypeBlock key={index} control={context.templateCtrl} 
                      msgID={value.msgID}
                      imgSrc={value.img} type={value.type} />
                  ))
                }
              </div>
              <div className='SubGroup'>
                {
                  compositeGroup.map((value, index) => (
                    <DataTypeBlock key={index} control={context.templateCtrl}
                      msgID={value.msgID}
                      imgSrc={value.img} type={value.type} />
                  ))
                }
              </div>
            </div>
          )
        }}
      </EditorContext.Consumer>
    );
  }
}

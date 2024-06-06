export const DragType = 'FIELD';

export const sourceSpec = {
    beginDrag: (props: any) => {
        console.log({props});
        return {
            name: 'abc',
        };
    },
};

export const targetSpec = {
    drop: (props: any, monitor: any, component: any) => {
      
    },
};

export const SourceCollect = (connect: any, monitor: any) => {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource(),
    };
};

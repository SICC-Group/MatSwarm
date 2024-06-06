import React, { FC } from 'react';
import './Container.less';

export interface ContainerProps  {
    style?: React.CSSProperties;
    className?: string;
}

export const Container: FC<ContainerProps> = (props) => {
    const className = `MgeContainer ` + (props.className || '');
    let style: React.CSSProperties = null;
    if (props.style) {
        style = props.style;
        if (!('marginTop' in style)) {
            style.marginTop = 0;
        } 
        if (!('flexGrow' in style)) { style.flexGrow = 1}
        if (!('display' in style)) { style.display = 'flex'}
        if (!('flexDirection' in style)) { style.flexDirection = 'column'}
    }
    else {
        style = {marginTop: 0, flexGrow: 1, display: 'flex', flexDirection: 'column'};
    }
    return (
        <div className={className} style={style}>
            {props.children}
        </div>
    );
}

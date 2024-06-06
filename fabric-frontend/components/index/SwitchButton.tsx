import React, { FC } from 'react';
import withStyles, { WithStyles } from 'react-jss';

const leftBg = require('../../img/left-arrow.png');
const rightBg = require('../../img/right-arrow.png');

const styles = {
    arrow: {
        backgroundColor: 'transparent',
        display: 'block',
        width: '44px',
        height: '68px',
        border: 'none',
        top: '76px',
        position: 'absolute',
    }
};

interface Props extends WithStyles<typeof styles>{
    position: 'left' | 'right';
    onClick: () => void;
}

const _SwitchButton: FC<Props> = ({classes, position, onClick}) => {
    return (
        <img className={classes.arrow} style={position === 'left'? { left: '-44px' } : { right: '-44px'}} 
            src={ position === 'left' ? leftBg : rightBg } onClick={onClick}/>
    );
}

export const SwitchButton = withStyles(styles)(_SwitchButton);

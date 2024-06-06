import React, { FC } from 'react';
import withStyles, { WithStyles } from 'react-jss';

const styles = {
    wrapper: {
        width: '1140px', 
        height: '432px',
        margin: '0 auto',
        marginTop: '35px',
        position: 'relative',
        cursor: 'pointer',
    }
}

interface WrapperProps extends WithStyles<typeof styles> {

}

const _Wrapper: FC<WrapperProps> = ({classes, children}) => {
    return (
        <div className={classes.wrapper}>
            {children}
        </div>
    )
};

export const CarouselWrapper = withStyles(styles)(_Wrapper);

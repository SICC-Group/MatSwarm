import React, { FC } from 'react';
import withStyles, { WithStyles } from 'react-jss';

const styles = {
    wrapper: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
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

export const EntryWrapper = withStyles(styles)(_Wrapper);

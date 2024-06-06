import React, { FC } from 'react';
import withStyles, { WithStyles } from 'react-jss';

const styles = {
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '110px',
    border: '1px solid #c2c2c2'
  }
}

const _Line: FC<WithStyles<typeof styles>> = ({classes}) => {
  return (
    <div className={classes.line}/>
  );
}

export const Line = withStyles(styles)(_Line);

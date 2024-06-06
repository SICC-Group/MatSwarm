import React, { FC } from 'react';
import withStyles, { WithStyles } from 'react-jss';
import { Container } from '../layout/Container';

const bannerBg = require('../../img/banner.png');
const indexText = require('../../img/index-text.png');

const styles = {
  banner: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: '480px',
    textAlign: 'center',
  },
  bgPic: {
    display: 'flex',
    width: '1920px',
    height: '100%',
    position: 'absolute',
    top: 0, left: 0,
  },
  textPic: {
    width: 'auto',
    height: '120px',
    float: 'left',
    marginLeft: '-15px',
  }
}

const _Banner: FC<WithStyles<typeof styles>> = ({ classes }) => {
  return (
    <div className={classes.banner}>
      <img width="100%" src={bannerBg} className={classes.bgPic} />
      <Container style={{zIndex: 1, flexGrow: 0}}>
        <img className={classes.textPic} style={{width: '600px'}} src={indexText} />
      </Container>
    </div>
  )
}

export const Banner = withStyles(styles)(_Banner);

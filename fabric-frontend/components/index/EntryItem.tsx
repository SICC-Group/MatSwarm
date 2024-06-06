import React, { FC } from 'react';
import withStyles, { WithStyles } from 'react-jss';

const benzene = require('../../img/benzene.png');

const styles = {
  'benzene': {
    '& a': {
      position: 'relative',
      display: 'block',
      margin: '0 auto',
      width: '192px',
    },
  },
  innerWrapper: {
    position: 'absolute',
    left: 0, right: 0, top: 0,
    height: '221px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: '35px',
    textAlign: 'center',
  },
  chn: {
    fontSize: '22px',
    color: '#444',
    minHeight: '62px',
  },
  eng: {
    fontSize: '16px',
    color: '#7b7b7b',
  },
};

interface EntryItemProps extends WithStyles<typeof styles> {
  titleZh: React.ReactNode;
  titleEn: React.ReactNode;
  img: string;
  url: string;
}

const _EntryItem: FC<EntryItemProps> = ({ classes, titleZh, titleEn, img, url }) => {
  return (
    <div className={classes.benzene}>
      <a href={url}>
        <img src={benzene} />
        <div className={classes.innerWrapper}>
          <img src={img} />
        </div>
        <div className={classes.title}>
          <p className={classes.chn}>{titleZh}</p>
          <p className={classes.eng}>{titleEn}</p>
        </div>
      </a>
    </div>
  );
}

export const EntryItem = withStyles(styles)(_EntryItem);

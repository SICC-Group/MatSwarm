import React, { FC, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Layout, Tooltip } from 'antd';

import Urls from '../../apis/Urls';

import withStyles, { WithStyles } from 'react-jss';
import { UserVisits } from '../../apis/service/UserVisits';
import { UserOnline } from '../../apis/service/UserOnline';

const { Footer } = Layout;


const styles = {
  Footer: {
    textAlign: 'center',
    background: '#1A242F',
    color: '#FFF',
    minWidth: '700px',
  },

  brand: {
    fontSize: '16px',
    '& p': {
      marginBottom: '18px',
    },
    '& a': {
      color: '#00a8ff',
    },
  },

  intro: {
    fontSize: '18px',
    '& li': {
      display: 'inline',
      borderRight: 'white solid',
      borderRightWidth: '1px',
      padding: '0 48px',

      '&:last-child': {
        borderRight: 'none',
      },

      '& a': {
        textDecoration: 'none',
        color: '#fff',
      }
    }
  }
}

interface FooterProps extends WithStyles<typeof styles> { }

const _MgeFooter: FC<FooterProps> = ({ classes }) => {

  const [visitCount, setVisitCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    UserVisits().then((value) => {
      setVisitCount(value);
    });
    UserOnline().then(value => {
      setOnlineCount(value);
    })
  }, [])

  let date = new Date();
  let year = date.getFullYear();

  return (
    <Footer className={classes.Footer}>
    </Footer>
  );
}

export const MgeFooter = withStyles(styles)(_MgeFooter);

import React, { FC } from 'react';
import withStyles, { WithStyles} from 'react-jss';

const styles = {
    Header: {
        position: 'relative',
    },

    Text: {
        fontSize: '24px',
        lineHeight: '32px',
        color: '#252525',
        position: 'relative',
    },
    Line: {
        position: 'absolute',
        border: '1px #E8E8E8 solid',
        margin: '15px 0',
        left: '-56px',
        right: '-56px',
    }
}

export interface HeaderProps extends WithStyles<typeof styles> {
    title: React.ReactNode;
}

const _Header: FC<HeaderProps> = ({classes, title}) => {
    return (
        <div className={classes.Header}>
            <div className={classes.Line}/>
            <div className={classes.Text}>
                <span style={{background: '#FFF', padding: '0 16px', position: 'relative', left: '-16px'}}>{title}</span>
            </div>
        </div>
    )
}

export const Header = withStyles(styles)(_Header);

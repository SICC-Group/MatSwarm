import React, { FC } from 'react';
import withStyles, { WithStyles} from 'react-jss';

const styles = {

    SubHeader: {
        fontSize: '20px',
        lineHeight: '26px',
        color: '#252525',
        marginTop: '20px',
        marginBottom: '16px',
    },
}

export interface SubHeaderProps extends WithStyles<typeof styles> {
    title: React.ReactNode;
}

const _SubHeader: FC<SubHeaderProps> = ({classes, title}) => {
    return (
        <div className={classes.SubHeader}>
            {title}
        </div>
    )
}

export const SubHeader = withStyles(styles)(_SubHeader);

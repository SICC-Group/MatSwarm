import React from 'react';
import { FormattedMessage } from 'react-intl';

export function TEXT(msgID: string, defaultMsg?: string) {
    return <FormattedMessage id={msgID} defaultMessage={defaultMsg} />
}

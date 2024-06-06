import React, { FC } from 'react';

import './FakeInput.less';

interface FakeInputProps {
    className?: string;
    style?: React.CSSProperties;
}

export const FakeInput: FC<FakeInputProps> = (props) => {
    const className = (props.className ? `FakeInput ${props.className}` : 'FakeInput');
    const _style = props.style || {};
    _style.backgroundColor = '#EEE';
    return (
        <span style={_style} className={className}/>
    )
}

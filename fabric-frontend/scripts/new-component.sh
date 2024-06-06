#!/bin/bash
cd ../components/
cat > $1.tsx <<EOF
import React, { Component } from 'react';
import './$1.less';

export interface $1Props {
    className?: string;
    style?: React.CSSProperties;
}

interface State {

}

export class $1 extends Component<$1Props, State> {
    
    constructor(props: any) {
        super(props);
    }
    
    render() {
        const className = '$1 ' + (this.props.className || '');

        return (
            <div className={className} style={this.props.style}>
            </div>
        );
    }
}
EOF

cat > $1.less <<EOF
.$1 {
    
}
EOF

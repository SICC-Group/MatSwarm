import React, { Component } from 'react';

import { Bar } from 'react-chartjs-2';


export interface LineGraphProps {
    className?: string;
    style?: React.CSSProperties;
    title: string | JSX.Element;
}

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
    ],
};

export class LineGraph extends Component<LineGraphProps> {
    
    constructor(props: any) {
        super(props);
    }
    
    render() {
        const className = 'LineGraph ' + (this.props.className || '');

        return (
            <div className={className} style={this.props.style}>
                {this.props.title}
                <Bar
                    data={data}
                    height={50}
                />
            </div>
        );
    }
}

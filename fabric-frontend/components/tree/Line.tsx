import React, { Component } from 'react';

const height = 60;
const width = 30;

interface CrossLineProps {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
}

const color = '#ADD4E0';
const strokeWidth = '1';

const TopLine = (
    <path d={`M${width / 2} ${0}v${height / 2}z`} stroke={color} strokeWidth={strokeWidth} strokeLinecap='round' vectorEffect='non-scaling-stroke' />
);

const BottomLine = (
    <path d={`M${width / 2} ${height / 2}v${height / 2}z`} stroke={color} strokeWidth={strokeWidth} strokeLinecap='round' vectorEffect='non-scaling-stroke' />
);

const LeftLine = (
    <path d={`M${0} ${height / 2}h${width / 2}z`} stroke={color} strokeWidth={strokeWidth} strokeLinecap='round' vectorEffect='non-scaling-stroke' />
);

const RightLine = (
    <path d={`M${width / 2} ${height / 2}h${width / 2}z`} stroke={color} strokeWidth={strokeWidth} strokeLinecap='round' vectorEffect='non-scaling-stroke' />
);

export class CrossLine extends Component<CrossLineProps> {
    render() {
        return (
            <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio='none' fill='none' xmlns='http://www.w3.org/2000/svg'>
                { this.props.top ? TopLine : null }
                { this.props.bottom ? BottomLine : null }
                { this.props.left ? LeftLine : null }
                { this.props.right ? RightLine : null }
            </svg>
        );
    }
}

interface SquareLineProps {
    minus: boolean;
    top?: boolean;
    bottom?: boolean;
}

const square = (
    <path d='M7.5 22.5v15h15v-15h-15z' stroke={color} strokeWidth={strokeWidth} strokeLinecap='round' vectorEffect='non-scaling-stroke' />
);

const minus = (
    <path d='M15 30h-4M15 30h4z' stroke={color} strokeWidth={strokeWidth} strokeLinecap='round' vectorEffect='non-scaling-stroke' />
);

const plus = (
    <path d='M15 30h-4M15 30h4M15 30v4M15 30v-4z' stroke={color} strokeWidth={strokeWidth} strokeLinecap='round' vectorEffect='non-scaling-stroke' />
);

const top = (
    <path d='M15 0v22.5z' stroke={color} strokeWidth={strokeWidth} strokeLinecap='round' vectorEffect='non-scaling-stroke' />
);

const bottom = (
    <path d='M15 60v-22.5z' stroke={color} strokeWidth={strokeWidth} strokeLinecap='round' vectorEffect='non-scaling-stroke' />
);

const right = (
    <path d='M30 30h-7.5z' stroke={color} strokeWidth={strokeWidth} strokeLinecap='round' vectorEffect='non-scaling-stroke' />
);
export class SquareLine extends Component<SquareLineProps> {
    render() {
        return (
            <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio='xMidYMid slice' fill='none' xmlns='http://www.w3.org/2000/svg'>
                {square}
                { this.props.minus ? minus : plus}
                {right}
                {this.props.top ? top : null}
                {this.props.bottom ? bottom : null}
            </svg>
        );
    }
}

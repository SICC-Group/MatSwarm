import React, { ComponentType, FC, useState } from 'react';
import { FlexLoading } from '../components/common/FlexLoading';

export interface WithLoading {
    loadBegin?: () => void;
    loaded: () => void;
}

export const withLoading = <P extends WithLoading>(Comp: ComponentType<P>, init?: boolean) => {

    type CompType = Omit<P, keyof WithLoading>;

    const result: FC<CompType> = (props) => {
        const [loading, setLoading] = useState(init);
        const handleLoaded = () => setLoading(false);
        const handleLoadBegin = () => setLoading(true);
        if (loading) {
            return <div></div>
        }
        else return (
            <Comp {...props as any} loaded={handleLoaded} loadBegin={handleLoadBegin}/>
        )
    }

    return result;
}

export interface LoadingWrapperProps {
    loading: boolean;
    style?: React.CSSProperties;
    className?: string;
}

export const LoadingWrapper: FC<LoadingWrapperProps> = (props) => {
    return (
        <div style={props.style} className={props.className}>
            {props.loading ? <FlexLoading /> : props.children }
        </div>
    )
}

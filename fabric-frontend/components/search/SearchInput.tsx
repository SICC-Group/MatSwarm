import React, { FC } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { Search } from '../../apis/define/search';

export interface Props extends RouteComponentProps {
    onSearch: (searchType: Search.MetaType, value: string) => void;
}

const _SearchInput: FC<Props> = (props) => {
    console.log(props.match.params);
    return (
        <div></div>
    )
}

export const SearchInput = withRouter(_SearchInput);

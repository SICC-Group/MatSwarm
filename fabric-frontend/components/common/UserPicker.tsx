import React from 'react';
import { Select } from 'antd';
import { SearchUser } from '../../apis/user/SearchUser';

const { Option } = Select;

let timeout: number | null = null;
let currentValue: string;

interface Props {
    username: string | undefined;
    onChange: (username: string | undefined) => void;
}

interface State {
    data: Array<{ username: string, real_name: string }>;
}

export class UserPicker extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    handleSearch = (value: string) => {

        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value;

        if (value) {
            timeout = setTimeout(() => {
                SearchUser(value).then((result) => {
                    if (currentValue === value) {
                        this.setState({
                            data: result,
                        })
                    }
                })
            }, 300) as any;

        }
        else {
            this.setState({ data: [] })
        }
    };

    handleChange = (value: string) => {
        this.props.onChange(value);
    };

    render() {
        const options = this.state.data.map(d => <Option key={d.username}>{d.real_name}</Option>);
        return (
            <Select
                showSearch
                value={this.props.username}
                placeholder={'选择一个用户'}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={null}
                style={{width: '100%'}}
            >
                {options}
            </Select>
        );
    }
}

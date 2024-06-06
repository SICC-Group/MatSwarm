import React from 'react';
import { Select, Spin } from 'antd';
import { SearchUser } from '../../apis/user/SearchUser';

const { Option } = Select;

interface Props {

}

interface State {
    data: Array<{ username: string, real_name: string }>;
    value: Array<{text: string, label: React.ReactNode}>;
    fetching: boolean;
}

export class MultipleUserSelect extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.lastFetchId = 0;

        this.state = {
            data: [],
            value: [],
            fetching: false,
        }
    }
    lastFetchId: number;

    fetchUser = (value: string) => {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ data: [], fetching: true });
        SearchUser(value).then(value => {
            // if (fetchId !== this.lastFetchId) {
            //     // for fetch callback order
            //     return;
            // }
            this.setState({
                data: value,
                fetching: false,
            })
        })
    };

    handleChange = (value: Array<{text: string, label: React.ReactNode}>) => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    };

    render() {
        const { fetching, data, value } = this.state;
        console.log('he')
        return (
            <Select
            mode="multiple"
                labelInValue
                value={value}
                placeholder="选择一个用户"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={this.handleChange}
                style={{ width: '100%' }}
            >
                {data.map(d => (
                    <Option key={d.username}>{d.real_name}</Option>
                ))}
            </Select>
        );
    }
}

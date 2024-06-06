import React, { FC, useEffect, useState } from 'react';
import { Select, Modal, Button, Checkbox } from 'antd';

import { GetExpertsList, GetAssignedExpert, Expert } from '../../../apis/certificate/GetExpertsList';
import { CertApply } from '../../../apis/certificate/AssignCertList';
import { TEXT } from '../../../locale/Text';

const { Option } = Select;

interface Props {
    visible: boolean;
    record: CertApply;
    onClose: () => void;
}

export const AssignViewModal: FC<Props> = (props) => {
    const [experts, setExperts] = useState<Expert[]>([]);
    const [assigned, setAssigned] = useState<string[]>([]);

    useEffect(() => {
        GetExpertsList().then(value => {
            setExperts(value);
        });
        if (props.record) {
            GetAssignedExpert(props.record.id).then(value => {
                let assigned: string[] = [];
                value.map((expert) => { assigned.push(expert.expert_username) });
                setAssigned(assigned);
            });
        }
    }, [props.record]);

    const expertToOption = () => {
        let children: any = []
        experts.map((value, index) => {
            children.push(<Option key={value.expert_username} value={value.expert_username}>{value.expert_name}</Option>);
        })
        return (children);
    }
    const expertToCheckbox = () => {
        let children: any = []
        experts.map((value, index) => {
            children.push(<Checkbox disabled key={value.expert_username} value={value.expert_username} style={{ width: '90%', marginLeft: '8px' }}>{value.expert_name}</Checkbox>);
        })
        return (children);
    }

    return (
        <Modal
            title={TEXT('cert:expert_list', '已分配验收专家')}
            visible={props.visible}
            onCancel={props.onClose}
            footer={<Button disabled>{TEXT('cert:ok', '确定')}</Button>}
        >
            <div className='ExpertSelect'
                style={{ height: '300px' }}>
                <Select
                    value={assigned}
                    mode='multiple'
                    style={{ width: '100%' }}
                    dropdownStyle={{ display: 'none' }}
                >
                    {expertToOption()}
                </Select>
                <Checkbox.Group value={assigned} style={{ width: '100%', height: '85%', overflowY: 'scroll' }}>
                    {expertToCheckbox()}
                </Checkbox.Group>
            </div>
        </Modal>
    );
}
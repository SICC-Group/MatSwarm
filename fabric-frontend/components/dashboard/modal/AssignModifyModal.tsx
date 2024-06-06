import React, { FC, useEffect, useState } from 'react';
import { Select, Modal, Button, Checkbox,notification } from 'antd';

import { GetExpertsList, GetAssignedExpert, Expert } from '../../../apis/certificate/GetExpertsList';
import { ModifyExpert } from '../../../apis/certificate/AssignExpert';
import { CertApply } from '../../../apis/certificate/AssignCertList';
import { TEXT } from '../../../locale/Text';


const { Option } = Select;

interface Props {
    visible: boolean;
    record: CertApply;
    onClose: () => void;
    onUpdate: () => void;
}

export const AssignModifyModal: FC<Props> = (props) => {
    const [experts, setExperts] = useState<Expert[]>([]); //所有可供选择的专家列表
    const [assigned, setAssigned] = useState<string[]>([]);  //被分配的专家

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

    const handleModify = () => {
        if (assigned.length === 0) {
            notification['error']({
                message: '操作失败',
                description: '未选择验收专家，请重新修改'
            });
        }
        else{
            ModifyExpert(props.record.id, assigned).then(res =>{
                window.location.reload()
            });
            props.onClose();
            props.onUpdate();
        }
        }
       

    const handleSelect = (value: string[]) => {
        setAssigned(value);
    }

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
            children.push(<Checkbox key={value.expert_username} value={value.expert_username} style={{ width: '90%', marginLeft: '8px' }}>{value.expert_name}</Checkbox>);
        })
        return (children);
    }

    return (
        <Modal
            title={TEXT('cert:expert_list', '验收专家列表')}
            visible={props.visible}
            onCancel={props.onClose}
            footer={<div>
                <Button style={{ display: 'none' }}>{assigned}</Button>
                <Button type='primary' onClick={handleModify}>{TEXT('cert:ok', '确定')}</Button>
            </div>}
        >
            <div className='ExpertSelect'
                style={{ height: '300px' }}>
                <Select
                    value={assigned}
                    mode='multiple'
                    style={{ width: '100%' }}
                    dropdownStyle={{width:'100%'}}
                    onChange={handleSelect}
                    showArrow
                    defaultOpen={false}
                    placeholder='请选择验收专家(可搜索)'
                    optionFilterProp="children"
                >
                    {expertToOption()}
                </Select>
                {/* <Checkbox.Group value={assigned} style={{ width: '100%', height: '85%', overflowY: 'scroll' }} onChange={handleSelect}>
                    {expertToCheckbox()}
                </Checkbox.Group> */}
            </div>
        </Modal>
    );
}
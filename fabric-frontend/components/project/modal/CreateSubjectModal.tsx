import React, { FC, useState } from 'react';
import './CreateSubjectModal.less';

import { Input, Modal, Select } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { UserPicker } from '../../common/UserPicker';

import { bool } from 'prop-types';

import { ProjectAll } from '../../../apis/define/Project';
import { Subject } from '../../../apis/define/Subject';

import Item from 'antd/lib/list/Item';

// type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

interface Props extends Omit<Omit<ModalProps, 'title'>, 'onOk'> {
    onOk: (id: string, name: string, institution: string, username: string) => void;
    visible: boolean;
    onClose: () => void;
}

export const CreateSubjectModal: FC<Props> = (props) => {

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [inst, setInst] = useState('');
    const [user, setUser] = useState<string | null>(null);

    const handleOk = () => {
        const formValid = user !== null && inst !== '' && name !== '' && id !== '';
        if (formValid) {
            props.onOk(id, name, inst, user);
        }
        props.onClose();
    };

    return (
        <Modal {...props} title={'创建课题'} onOk={handleOk}
            onCancel={props.onClose} visible={props.visible}>            
            <div>课题编号</div>
            <Input value={id} onChange={(e) => setId(e.target.value)} />
            <div>课题名称</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <div>牵头承担单位</div>
            <Input value={inst} onChange={(e) => setInst(e.target.value)} />
            <div>选择项目负责人</div>
            <UserPicker onChange={setUser} username={user} />
        </Modal>
    );
};

const { Option } = Select;
interface PropsS extends Omit<Omit<ModalProps, 'title'>, 'onOk'> {
    onOk: (projectId: string, id: string, name: string, institution: string, username: string) => void;
    visible: boolean;
    onClose: () => void;
    dataSource: ProjectAll[];
}
export const CreateSubjectModalS: FC<PropsS> = (props) => {

    const [id, setId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [name, setName] = useState('');
    const [inst, setInst] = useState('');
    const [user, setUser] = useState<string | null>(null);
    
    const handleOk = () => {
        const formValid = user !== null && inst !== '' && name !== '' && id !== '';
        if (formValid) {
            props.onOk(projectId, id, name, inst, user);
        }
        props.onClose();
    };

    const handleChange = (value: any) => {
        setProjectId(value);
    };

    return (
        <Modal {...props} title={'创建课题'} onOk={handleOk}
            onCancel={props.onClose} visible={props.visible}>
            <div>项目名称</div>
            <Select style={{ width: '470px' }} onChange={handleChange}>
                {
                    props.dataSource.map((item) => {
                        return (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        );
                    })
                }
            </Select>
            <div>课题编号</div>
            <Input value={id} onChange={(e) => setId(e.target.value)} />
            <div>课题名称</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <div>牵头承担单位</div>
            <Input value={inst} onChange={(e) => setInst(e.target.value)} />
            <div>选择项目负责人</div>
            <UserPicker onChange={setUser} username={user} />
        </Modal>
    );
};

interface ChangeProps extends Omit<Omit<ModalProps, 'title'>, 'onOk'> {
    onOk: (name: string, institution: string, username: string) => void;
    onOkAll: (id: string, projectId: string, name: string, institution: string, username: string, userContact: string) => void;
    visible: boolean;
    type: boolean; // 判断是否为全局修改，true为全局修改，false为部分修改
    onClose: () => void;
    subGet: Subject;
    dataSource: ProjectAll[];
}
export const ChangeSubjectModalALL: FC<ChangeProps> = (props) => {

    const [id, setId] = useState(props.subGet.id);
    const [projectId, setProjectId] = useState('');
    const [name, setName] = useState(props.subGet.name);
    const [inst, setInst] = useState(props.subGet.institution);
    const [user, setUser] = useState<string | null>(props.subGet.leader);
    const [userContact, setUserContact] = useState(props.subGet.leader_contact_method);

    const handleOk = () => {
        if (props.type) {
            const formValid = user !== null && inst !== '' && name !== '' && id !== '' && projectId !== '' && userContact !== '' ;
            if (formValid) {
                props.onOkAll(id, projectId, name, inst, user, userContact);
            }
            props.onClose();
        } else {
            const formValid = user !== null && inst !== '' && name !== '';
            if (formValid) {
                props.onOk(name, inst, user);
            }
            props.onClose();
        }

    };

    const handleChange = (value: any) => {
        setProjectId(value);
    };

    if (props.type) {
        return (
            <Modal {...props} title={'全局修改课题'} onOk={handleOk}
                onCancel={props.onClose} visible={props.visible}>
                <div>课题编号</div>
                <Input value={id} onChange={(e) => setId(e.target.value)} />
                <div>选择所属项目</div>
                <Select style={{ width: '470px' }} onChange={handleChange}>
                    {
                        props.dataSource.map((item) => {
                            return (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            );
                        })
                    }
                </Select>
                <div>课题名称</div>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                <div>牵头承担单位</div>
                <Input value={inst} onChange={(e) => setInst(e.target.value)} />
                <div>选择项目负责人</div>
                <UserPicker onChange={setUser} username={user} />
                <div>负责人联系方式</div>
                <Input value={userContact} onChange={(e) => setUserContact(e.target.value)} />
            </Modal>
        );
    }
    return (
        <Modal {...props} title={'部分修改课题'} onOk={handleOk}
            onCancel={props.onClose} visible={props.visible}>            
            <div>课题名称</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <div>牵头承担单位</div>
            <Input value={inst} onChange={(e) => setInst(e.target.value)} />
            <div>选择项目负责人</div>
            <UserPicker onChange={setUser} username={user} />
        </Modal>
    );
};

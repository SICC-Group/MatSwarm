import React, { FC, useState, useEffect } from 'react';
import { Modal, Table, Button, Tag } from 'antd';

import { TEXT } from '../../../locale/Text';
import { RoleToMsgID } from '../../../apis/define/User';
import { SubjectMember, GetSubjectMemebers } from '../../../apis/project/GetSubjectMembers';
import { MoveOutMemeber } from '../../../apis/project/MoveOutMember';
import { AddSubjectMember } from '../../../apis/project/GetSubjectMembers';
import { UserPicker } from '../../common/UserPicker';

export interface Props {
    subjectID: string;
    visible: boolean;
    onCancle: () => void;
}
const Column = Table.Column;
function NumberToRoles(role_number: number) {
    var roles: number[] = [];
    var role_string = role_number.toString(2);
    for (var i = 0; i < role_string.length; i++) {
        if (role_string[role_string.length - i - 1] === '1') roles.push(i);
    }
    return roles
}
export const SubjectMembersModal: FC<Props> = (props) => {

    const [members, setMembers] = useState<SubjectMember[]>([]);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        if (!props.visible) return;
        GetSubjectMemebers(props.subjectID).then(value => {
            setMembers(value.results);
        })
    }, [props.subjectID, props.visible]);

    const handleMoveOut = (e: any) => {
        MoveOutMemeber(props.subjectID, e.target.value);
    };
    const handleAddMember = (e: any) => {        
        // console.log(user);
        AddSubjectMember(props.subjectID, user);
    };

    return (
        <Modal visible={props.visible} title={TEXT('subject_members', '全部成员')} width='650px' footer={null} bodyStyle={{ padding: '15px' }} onCancel={props.onCancle}>
            <div style={{ width: '500px', float: 'left' }}>
                <UserPicker  onChange={setUser} username={user}/> 
            </div>
            <Button onClick={handleAddMember}>添加成员</Button>
            <Table dataSource={members} size="small" scroll={{ y: 240 }} rowKey={'id'}>
                <Column title={TEXT('name', '成员姓名')} key="real_name" dataIndex="real_name" width='100px'></Column>
                <Column title={TEXT('unit', '单位')} key="institution" dataIndex="institution" width='150px'></Column>
                <Column title={TEXT('email', '邮箱地址')} key="email" dataIndex="email" width='150px'></Column>
                <Column title={TEXT('permission', '权限')} key="roles" dataIndex="roles" width='100px'
                    render={text => (
                        (text).map((v: number) => <Tag color="blue" key={v}>{TEXT(RoleToMsgID(v))}</Tag>)
                    )}></Column>
                <Column title={TEXT('action', '操作')} key="username" dataIndex="username" width='100px'
                    render={text => (
                        <Button type="danger" size="small" value={text} onClick={handleMoveOut}>
                            {TEXT('move_out', '移出项目')}
                        </Button>
                    )}></Column>
            </Table>
        </Modal>
    )
}
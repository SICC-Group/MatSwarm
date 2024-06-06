import React, { FC, useState } from 'react';
import {Dropdown, Button, Icon, Menu } from 'antd';
import { Subject } from '../../apis/define/Subject';
import { SubjectMembersModal } from './modal/SubjectMembersModal';

interface Props {
    projectID: string;
    subject: Subject;
}

export const SubjectItem: FC<Props> = (props) => {

    const [visible, setVisible] = useState(false);

    function handleMemberClick(e: any) {
        setVisible(true);
    }
    
    return (
        <div style={{ background: '#fff', clear: 'both', margin: '16px 48px', overflow: 'hidden' }}>                
                <div style={{ padding: '11px 24px 11px 18px', borderBottom: '5px solid #F5F0F2', fontSize: '18px', color: '#252525'  }}>
                    {props.subject.name}
                    <div style={{ float: 'right'}}>
                        
                        <Button 
                            onClick={handleMemberClick}
                            style={{background: '#236B94', color: '#FFF', fontSize: '14px' }}>
                            成员管理
                        </Button>
                    </div>
                </div>
                <div style={{clear: 'both', padding: '1px'}}>
                    <div  style={{ float: 'left', padding: '13px 69px 13px 18px', fontSize: '16px', color: '#252525' }}>
                        课题负责人：{props.subject.leader}
                    </div>
                    <div style={{ float: 'left', padding: '13px 78px 13px 73px', fontSize: '16px', color: '#252525' }}>
                        <Button>课题信息统计</Button>
                    </div>
                    <div style={{ float: 'right', padding: '13px 18px 13px 176px', fontSize: '16px', color: '#8F8F8' }}>
                        负责人联系方式：{props.subject.leader_contact_method}
                        <i style={{color: '#FF8C00'}} className='fa fa-cog fa-fw'></i></div>                 
                </div>
                <SubjectMembersModal 
                    visible={visible} onCancle={() => setVisible(false)} subjectID={props.subject.id}/>
            </div>
    )
}
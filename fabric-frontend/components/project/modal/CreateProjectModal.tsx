// 创建项目弹框

import React, { FC, useState, useEffect } from 'react';
import { Button, Modal, Input,Form,Select, message} from 'antd';
import { TEXT } from '../../../locale/Text';
import { UserPicker } from '../../common/UserPicker';
import {CreateProject}from'../../../apis/project/CreateProject';
import {CreateSubject} from'../../../apis/project/CreateSubject';
 import{Subject,subject} from'../../../apis/define/Subject';

export interface Props {
    visible: boolean;
    // 关闭
    onCancel: () => void;
   

  }
  const { Option } = Select;
  
export const CreateProjectModal: FC<Props> = (props) => {
    
    const [state, setstate] = useState<boolean>(false);
    const [Id, setId] = useState<string>("");
    const [Name, setName] = useState<string>("");
    const [Institution, setInstitution] = useState<string>("");
    const [ProjectArea, setProjectArea] = useState<[]>([]);
    const [leader, setLeader] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(true);
    const [user, setUser] = useState<string|null>(null);
    const [subject_user, setsubjectUser] = useState<string | null>(null);
    const [subject_id, setsubjectId] = useState('');
    const [subject_name, setsubjectName] = useState('');
    const [subject_inst, setsubjectInst] = useState('');
    const [SubjectList,setSubtjectList] = useState<subject[]>([]);
    
    
    const showModal=()=> {
        setstate(true);
    }
    const getId = (e: any) => {
        setId(e.target.value);
        if (e.target.value !== "" && Name !=="" && user!==""&&Institution !==""&&ProjectArea !==[]) { setDisabled(false); }
        else { setDisabled(true); }
    }
    const getName = (e: any) => {
        setName(e.target.value);
        if (e.target.value !== "" && Id !== "" && user !== "" &&Institution !==""&&ProjectArea !==[]) { setDisabled(false); }
        else { setDisabled(true); }
    }
    const getInstitution = (e: any) => {
        setInstitution(e.target.value);
        if (e.target.value !== "" && Name !== "" && user!== ""&&Id !==""&&ProjectArea !==[]) { setDisabled(false); }
        else { setDisabled(true); }
    }
    const getProjectArea = (value: any) => {
        setProjectArea(value);
        if (value !== " "&& Name !== "" && user!==""&&Institution !==""&&Id !=="") { setDisabled(false); }
        else { setDisabled(true); }
    }

    
    let i=0;
    // let SubjectList=[{}];
    const handleNext = () =>{
     const temp  = SubjectList;
     temp.push({
     id: subject_id,
     institution: subject_inst,
     name: subject_name,
     leader: subject_user});
     setSubtjectList(temp);
    console.log('typeofobj ',SubjectList[i].id);
    console.log('subject',SubjectList);
    i++;
    setsubjectId('');
    setsubjectInst('');
    setsubjectName('');
    setsubjectUser('')
    message.info('课题信息已存储，可继续添加')
    // form.resetFileds();
}
const onCreate = () => {
    CreateProject(Id,ProjectArea,Name,user,Institution,'','','');
    console.log(SubjectList);
    console.log(SubjectList.length)
    for(let j=0;j<SubjectList.length;j++){
    console.log(SubjectList[j])
    CreateSubject(Id,SubjectList[j].id,SubjectList[j].name,SubjectList[j].institution,SubjectList[j].leader)
    }
    window.location.reload();
    };

return(
    <Modal
        title="申请创建新的项目"
        centered
        visible={props.visible}
        onCancel={props.onCancel}
        okText={TEXT('dash:apply_for_project', '申请创建')}
        okButtonProps={{ disabled:disabled }}
        onOk={onCreate}
        width='700pt'
        style={{left:50}}
        >
        <div style={{flexDirection:'row',display:'flex'}}>
           <Form layout="vertical" style={{width:'350pt'}}>
                <Form.Item label="选择所属材料领域专项：">
                    <Select placeholder='选择所属材料领域专项' onChange={getProjectArea}>
                        <Option value="纳米科技">纳米科技</Option>
                        <Option value="新能源汽车">新能源汽车</Option>
                        <Option value="智能电网技术与设备">智能电网技术与设备</Option>
                        <Option value="Others">Others</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="项目编号：" >
                    <Input  placeholder='填写项目编号' onChange={getId}></Input>
                </Form.Item>
                <Form.Item label="项目名称：">
                    <Input  placeholder='填写项目名称' onChange={getName}></Input>
                </Form.Item>
                <Form.Item label="项目牵头承担单位：">
                    <Input  placeholder='填写项目牵头承担单位' onChange={getInstitution}></Input>
                </Form.Item>
                <Form.Item label="项目负责人：">
                <UserPicker onChange={setUser} username={user}/> 
                </Form.Item>
            </Form>
             <div style={{display: 'flex' , width: '450px', justifyContent: 'center' , alignItems: 'center'}}>
                <div  style={{justifyContent: 'center'}}>
               <div >
                  <Button onClick={showModal} type="primary" style={{width:'50pt',height:'50pt',color:'white',fontSize:'30pt'}}>+</Button>
               </div>
               <p style={{paddingTop:'10pt',fontWeight:'bold',paddingLeft:'0pt',paddingBottom:'0pt',justifyContent: 'center'}}>添加下属课题</p>
               <p style={{paddingLeft:'0pt'}}>(可添加多个)</p>
              </div>
              <Modal
             title="添加下属课题"
             onCancel={() => setstate(false)}
             cancelText={'取消'}
             okText={TEXT('dash:apply_for_subject', '提交')}
             onOk={handleNext}
             visible={state}
             destroyOnClose={true}
               >
             <Form layout="vertical" id='form' >
              <Form.Item label="课题编号："> 
            <Input  placeholder='填写课题编号' value={subject_id} onChange={(e) => setsubjectId(e.target.value)} />
            </Form.Item>
              <Form.Item label="课题名称：">
                  <Input  placeholder='填写课题名称'value={subject_name} onChange={(e) => setsubjectName(e.target.value)} />
              </Form.Item>
              <Form.Item label="课题牵头承担单位：">
                  <Input  placeholder='填写课题牵头承担单位'value={subject_inst} onChange={(e) => setsubjectInst(e.target.value)} />
              </Form.Item>
              <Form.Item label="课题负责人：">
                  <UserPicker onChange={setsubjectUser} username={subject_user}/>
              </Form.Item>
            </Form>
      </Modal>
            </div>
        </div>
    </Modal>
    
)
}

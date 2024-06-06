import {notification,Input,Modal,Button,Slider,InputNumber,Row,Col} from 'antd';
import React, { FC, useState, useEffect } from 'react';
import { TEXT } from '../../../locale/Text';
import { MgeError } from '../../../apis/Fetch';
import{ExpertTemplateScoring,PostExpertTemplateScoring} from '../../../apis/template/Expert_scoring';
export interface Props {
    admin?: boolean;
    visible?: boolean;
    onClose: () => void;
    data:ExpertTemplateScoring[];
    currentid:number;
  }
 
  export const ExpertTemplateModal: FC<Props> = (props) => {
    const [other, setOther] = useState('');
    const [value, setValue] = useState<number>(0);
    const[iscored,setIscored]=useState(false);
    const onChange = (value:number) => {
      setValue(value);
    }; 
  const handleAddScore = () => {
     setIscored(true);
    PostExpertTemplateScoring(props.currentid,other,value).then(() => {
      setValue(0);
      setOther('');
      notification['success']({
        message: TEXT('dash:email_sent', '提交成功'),
      })
    }).catch((reason:MgeError) => {
      notification['error']({
        message:reason.message,
      })
    })
    props.onClose();
  }
    return (
      <div>
      <Modal
        title={'输入分数'}
        footer={[
          <div>  
          <Input placeholder='评语'value={other} onChange={event=>setOther(event.target.value)}/>
          <Button key="submit" type="primary"onClick={handleAddScore} disabled={value<6&&other.length===0}>
            提交
          </Button></div>
        ]}
        visible={props.visible} onCancel={props.onClose} onOk={props.onClose}destroyOnClose={true}
        >
          <Row>
        <Col span={12}>
          <Slider
            min={1}
            max={10}
            onChange={onChange}
            value={typeof value === 'number' ? value: 0}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={1}
            max={10}
            style={{ marginLeft: 16 }}
            value={value}
            onChange={onChange}
          />
        </Col>
      </Row>
      </Modal >
      {/* <ExpertEvaluateTemplate 
        iscored={iscored}
        /> */}
      </div>
    )
  }

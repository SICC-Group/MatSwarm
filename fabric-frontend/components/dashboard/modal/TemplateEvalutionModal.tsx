import Urls from "../../../apis/Urls";
import React, { FC, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { TEXT } from '../../../locale/Text';

export interface Props {
  evaluationAvgscore?:number;
  evaluationResult?: any[];
  visible: boolean;
  onClose: () => void;
}

export const TemplateEvaluationModal: FC<Props> = (props) => {

let i = 1;

return(
    <div>
    <Modal
        visible={props.visible}
        title={TEXT('dataShow:template-scored', '专家评价')}
        onCancel={props.onClose}
        footer={null}
        width={800}
    >
    
    { props.evaluationAvgscore!=0 ?
    (<div>
        <div className='card' style={{ background: 'white' }}>
        <div className='issue_time' >{TEXT('dataShow:template-avgscore', '模板平均分为:')} {props.evaluationAvgscore}</div>
            <div className='table_row'>
            <div className='table' style={{ borderRadius: '8px 0 0 0', width: '15%' }}>{TEXT('dataShow:experts-list', '专家列表')}</div>
            <div className='table' style={{width:'15%'}}>{TEXT('dataShow:template-score', '模板评分')}</div>
            <div className='table' style={{ borderRadius: '0 8px 0 0',width: '70%' }}>{TEXT('dataShow:experts-comment', '专家评语')}</div>
        </div>
    </div>
    <div>
    {
        props.evaluationResult.map((res: any) => {
            return (
                <div className='table_row' style={{ marginBottom: '4px' }}>
                <div style={{textAlign:'center',width:'15%'}}>{TEXT('dataShow:experts', '专家')} {i++}</div>
                <div style={{textAlign:'center',width:'15%'}}>{res[0]}</div>
                <div style={{textAlign:'center',width:'70%'}}>{res[1]}</div>
            </div>
            );
        })
    }
    </div>
    </div>):(TEXT('dataShow:template-not-scored', '暂无评分'))
    }
    
    </Modal>
  </div>
)

}
import React, { FC, useState } from 'react';
import { Button, Divider, Modal, notification } from 'antd';

import { GetTemEvalution } from '../../../apis/template/Get';
import { ReviewState } from '../../../apis/define/ReviewState';
import { DeleteTemplate } from '../../../apis/template/Delete';
import { PassTemplate } from '../../../apis/template/ReviewTemplate';
import { TemplatesReview } from '../../../apis/define/TemplateReview';
import { GetReviewedTemplate } from '../../../apis/template/GetReviewedTemplate';
import { TemplateEvaluationModal } from '../modal/TemplateEvalutionModal';
import { TEXT } from '../../../locale/Text';

export interface Props {
    record: TemplatesReview;
    admin?: boolean;
    onView: (record: TemplatesReview) => void;
    onRefuse: (record: TemplatesReview) => void;
    informUpdate: () => void;
    informDeleted: () => void;
    allowDelete?: boolean;
    allowEdit?: boolean;
}

export const TemplatesReviewAction: FC<Props> = (props) => {
    const { record, admin, onView } = props;
    const [yesLoading, setYesLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewEvalutionModal, setShowViewEvalutionModal] = useState(false);
    const [temEvalutionData, setTemEvalutionData] = useState<any[]>([]);
    const [temEvaAvgScore, setTemEvaAvgScore] = useState(0);

    const handleYesClick = () => {
        setYesLoading(true);
        PassTemplate(record.id).then(() => {
            GetReviewedTemplate(record.id).then((result) => {
                Object.assign(record, result);
                notification['success']({
                    message: TEXT('op_success', '操作成功')
                })
                props.informUpdate();
                setYesLoading(false);
            })

        }).catch((reason: Error) => {
            notification['error']({
                message: reason.message,
            })
        })
    }

    //   const handleViewButtonClick = () => {
    //     window.open('/storage/check_template/' + record.id);
    //   }

    const handleEditButtonClick = () => {
        window.open('/storage/edit_template/' + record.id);
    }
    const handleDeleteButtonClick = () => {
        setShowDeleteModal(true);
    }

    const handleShowViewEvalutionButtonClick = () => {  // 点击“查看评价”按钮弹窗
        setShowViewEvalutionModal(true);
        // setTemEvalutionData([[1,'hhh','a'],[9,'hhh','a']]);
        // setTemEvaAvgScore(5.0);	
        GetTemEvalution(record.id).then((value: any) => {
            setTemEvalutionData(value.score);
            setTemEvaAvgScore(value.avg_score);
            console.log(value.score,value.avg_score);
        });
    }

    // const handleShowViewEvalutionButtonClickOK = () => {  // 点击“查看评价”按钮弹窗中的按钮关闭弹窗
    //     setShowViewEvalutionModal(false);
    // }

    // const handleShowViewEvalutionButtonClickCancel = () => {  // 关闭 “查看评价”弹窗
    //     setShowViewEvalutionModal(false);
    // };

    const yesButton = <Button size='small' type='primary' loading={yesLoading} onClick={handleYesClick}>{TEXT('dash:approve', '通过')}</Button>;
    const noButton = <Button size='small' type='danger' onClick={() => props.onRefuse(record)}>{TEXT('dash:disapprove', '拒绝')}</Button>;
    const viewButton = <Button size='small' onClick={handleShowViewEvalutionButtonClick}>{TEXT('dash:view_data_evaluation', '查看评价')}</Button>;
  
    return (
        <div>
            <span>
                
                {record.avg_score != -1 ? viewButton : null}
                {record.avg_score != -1 ? <Divider type="vertical" /> : null}
                {props.allowEdit ? <Button size='small' type='primary' onClick={handleEditButtonClick}>{TEXT('template:edit', '修改')}</Button> : null}
                {props.allowEdit ? <Divider type="vertical" /> : null}
                {props.allowDelete && record.data_count == 0 ? <Button size='small' type='danger' onClick={handleDeleteButtonClick}>{TEXT('template:delete', '删除')}</Button> : null}
                {props.allowDelete && record.data_count == 0 ? <Divider type="vertical" /> : null}
                {admin && !(record.review_state == ReviewState.Approved) ? yesButton : null}
                {admin && !(record.review_state == ReviewState.Approved) ? <Divider type="vertical" /> : null}
                {admin && !(record.review_state == ReviewState.Approved) ? noButton : null}
                {admin && !(record.review_state == ReviewState.Approved) ? <Divider type="vertical" /> : null}
            </span>
            <TemplateEvaluationModal                   // “查看评价”的弹窗内容
                evaluationResult={temEvalutionData}
                visible={showViewEvalutionModal}
                evaluationAvgscore={temEvaAvgScore}
                onClose={() => { setShowViewEvalutionModal(false); setTemEvalutionData([]); setTemEvaAvgScore(0) }}
            />
            <Modal
                title={TEXT('warning', '警告')} 
                visible={showDeleteModal}
                okText={TEXT('ok', '确认')}
                cancelText={TEXT('cancel', '取消')}
                onCancel={() => setShowDeleteModal(false)}
                onOk={() => {
                    DeleteTemplate(record.id).then(value => {
                        setShowDeleteModal(false);
                        props.informDeleted();
                    })
                }}>
                {TEXT('template:delete_warning', '确定要删除这个模板吗？')}
            </Modal>
        </div>
    )
}

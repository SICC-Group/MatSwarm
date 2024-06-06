import React, { FC } from 'react';
import { Modal, Spin } from 'antd';

export interface Props {
    loading?: boolean;
}

export const LoadingModal: FC<Props> = ({ loading }) => {
    return (
        <Modal visible={loading} footer={null} closable={false} centered>
            <div style={{ textAlign: 'center' }}>
                <Spin size='large' />
            </div>
        </Modal>
    )
}
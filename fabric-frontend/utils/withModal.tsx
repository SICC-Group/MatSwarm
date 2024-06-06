import React, { ComponentType } from 'react'
import { Modal } from 'antd';

export interface WithModal {
  visible?: boolean;
  onClose: () => void;
}

export const withModal = <P extends WithModal>(Comp: ComponentType<P>, title?: React.ReactNode) => {
  return class extends React.Component<P> {
    public render() {
      const { props } = this;
      return (
        <Modal title={title}
          onCancel={props.onClose} onOk={props.onClose}
          // footer={[
          //   <Button key="submit" type="primary" onClick={props.onClose}>
          //     关闭
          //           </Button>
          // ]}
          footer={null}
          visible={props.visible}>
          <Comp {...props} />
        </Modal>
      )
    }
  }
}

import React, {FC, useEffect, useState} from 'react';
import { Modal } from 'antd';
import { TEXT } from '../../../locale/Text';
import {Dataset} from "../../../apis/define/Dataset";
import {Button} from "antd";


export interface Props {
    record: number[];
    visible: boolean;
    onClose: () => void;

}

export const DatasetModal: FC<Props> = (props) => {

    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);



    return (
        <div>
            <Modal
                title={TEXT('data', '数据列表')}
                visible={props.visible}
                onOk={() => { props.onClose(); setPage(0); } }
                onCancel={props.onClose}
                okText={TEXT('close', '关闭')}
                closable={false}
                cancelButtonProps={{ disabled: true, style: { display: 'none' } }}
            >
                {props.record.slice(page * pageSize , page * pageSize + pageSize).map((v) => {
                    return (
                        <p> <a href={"/storage/data/" + v} target="_blank">{v}</a> </p>
                    );
                })}
                <div style={{ display:'flex', justifyContent:"center", alignItems:"center"}}>
                    <Button type = 'link' disabled={page === 0} onClick={() => { setPage(page - 1 ); }}>上一页</Button>
                    {page + 1} / {Math.ceil(props.record.length / pageSize) > 0 ? Math.ceil(props.record.length / pageSize) : 1}
                    <Button type = 'link' disabled={page + 1 >= props.record.length / pageSize} onClick={() => { setPage(page + 1 ); }}>下一页</Button>
                </div>

            </Modal>
        </div>
    )
}


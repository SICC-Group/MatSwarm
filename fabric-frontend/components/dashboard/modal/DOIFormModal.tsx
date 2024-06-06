import React, { FC, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { AddDataset, AddDatasetInfo, RegisterDoi, DatasetIds } from '../../../apis/data/DatasetList';
import { TEXT } from '../../../locale/Text';

export interface Props {
    visible: boolean;
    onCancel: () => void;
    dataset: number[];
}

const { Option } = Select;
export const DOIFormModal: FC<Props> = (props) => {
    const [title, setTitle] = useState<string>("");
    const [project, setProject] = useState<string>("");
    const [contributor, setContributor] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(true);

    const getTitle = (e: any) => {
        setTitle(e.target.value);
        if (e.target.value != "" && project != "" && contributor != "") { setDisabled(false); }
        else { setDisabled(true); }
    }
    const getProject = (value: any) => {
        setProject(value);
        if (title != "" && value != "" && contributor != "") { setDisabled(false); }
        else { setDisabled(true); }
    }
    const getContributor = (e: any) => {
        setContributor(e.target.value);
        if (title != "" && project != "" && e.target.value != "") { setDisabled(false); }
        else { setDisabled(true); }
    }
    const onCreate = () => {
        var test: AddDatasetInfo = { data_ids: props.dataset, title: title, project: project, contributor: contributor };
        AddDataset(test).then(value => {
            var datasets: DatasetIds = {dataset_ids: [value.id]}
            RegisterDoi(datasets);
        });
        window.location.href = "/dashboard/#/dataset";
    }
    return (
        <Modal
            visible={props.visible}
            title={TEXT('dash:register_doi', '注册DOI')}
            okText={TEXT('dash:apply_for_doi', '申请注册DOI')}
            onCancel={props.onCancel}
            onOk={onCreate}
            okButtonProps={{ disabled: disabled }}
            cancelButtonProps={{ disabled: true, style: { display: 'none' } }}
        >
            <Form layout="vertical">
                <Form.Item label={TEXT('dash:dataset_title', '数据集标题：')}>
                    <Input onChange={getTitle} />
                </Form.Item>
                <Form.Item label={TEXT('dash:person_in_charge', 'DOI负责人：')}>
                    <Input onChange={getContributor} />
                </Form.Item>
                <Form.Item label={TEXT('dash:project', '所属项目：')}>
                    <Select onChange={getProject}>
                        <Option value="973">973 subject</Option>
                        <Option value="863">863 project</Option>
                        <Option value="NSFC">National Natural Science Foundation</Option>
                        <Option value="NSTMP">National Science and Technology major projects</Option>
                        <Option value="NKRDP">National key research and development plan</Option>
                        <Option value="TIGP">Technology Innovation Guide Program</Option>
                        <Option value="BTMP">Base and talent special</Option>
                        <Option value="LOCAL">Provincial and ministerial level and local projects</Option>
                        <Option value="PARTNER">Factory Association Project</Option>
                        <Option value="OTHER">Others</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}

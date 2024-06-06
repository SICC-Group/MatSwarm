import React, { FC } from 'react';
import {notification, Radio, Table, Button, Divider} from 'antd';
import {TEXT} from '../../../locale/Text';

const {Column} = Table;
interface Test {
    test ?: boolean
}

export const MyTemplateSplicing: FC<Test> = (props) => {
    return (
        <div style={{width: '100%'}}>
            <Button><a href={'/template_splicing/create'}>{TEXT('dash:create_splicing_task', '创建模板拼接任务')}</a></Button>
            <Table dataSource={[{id: '1'}]} >
                <Column title={TEXT('dash:ID', '拼接模板编号')}/>
                <Column title={TEXT('dash:title', '拼接模板标题')}/>
                <Column title={TEXT('dash:uploader', '上传人')}/>
                <Column title={TEXT('dash:upload_time', '上传时间')}/>
                <Column align='center' title={TEXT('dash:action', '操作')} render={(text, record) => {
                    return (
                        <Button.Group>
                            <Button>{TEXT('dash:view', '查看')}</Button>
                            <Divider type='vertical'/>
                            <Button>{TEXT('dash:modify', '编辑')}</Button>
                            <Divider type='vertical'/>
                            <Button><a href={'/data_splicing' }>{TEXT('dash:splice_data', '拼接数据')}</a></Button>
                        </Button.Group>
                    )
                }}/>
            </Table>

        </div>
    )
}


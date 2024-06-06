import React, { FC, useState, useEffect } from 'react';
import {Modal, Tree, Button} from 'antd';
import {GetSavePath} from '../../../apis/export/ExportData';

const { TreeNode } = Tree;
interface PathModalProps{
    visible: boolean;
    onCancel: () => void;
    token ?: string;
}


function GetPath (origin_data: any[], path: string, res: any){
    const result: any[] = [];
    origin_data.map((item) => {
        if(item.path === path) {
            item.children = res;
        }
        result.push(item)
    })
    origin_data.map((item) => {
        if (item.children){
          return  GetPath(item.children, path, res)
        }
    })
    return result;
}

export const PathModal: FC<PathModalProps> = (props) => {
    const [pathList, setPathList] = useState([]);
    const [selectedPath, setSelectedPath] = useState(null)
    useEffect(() => {
        GetSavePath(props.token).then((res: any) => {
            setPathList(res);
        });
    },[]);

    const  handleExpand = (expandKeys: string[]) => {
       const path = expandKeys[expandKeys.length - 1] ;
       GetSavePath(props.token, path).then((res) => {
           const temp = pathList;
           temp.map((item) => {
               if (path === item.path){
                   item.children = res;
               }
           })
           console.log(GetPath(pathList, path, res));
           if (temp.length >= 1) { setPathList([]); setPathList(temp);}
       })
   }

    const renderTree = (data: any[]) =>{
        return      data.map((item: any) => {
            if (item.children) {
                return <TreeNode title={item.name} key={item.path} selectable={!item.isLeaf}>
                    {renderTree(item.children)}
                </TreeNode>
            }

            else {
                return <TreeNode title={item.name} key={item.path} isLeaf={item.isLeaf} selectable={!item.isLeaf}/>
            }

        });
    }


    return (
        <Modal
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button onClick={props.onCancel}>取消</Button>,
                <Button type='primary' disabled={selectedPath == null}>确认</Button>
            ]}
        >{
            pathList &&
                <Tree
                    onExpand={(expandedKeys) => {handleExpand(expandedKeys)}}
                    onSelect={(selectedKeys) => {setSelectedPath(selectedKeys[0])}}
                >
                {renderTree(pathList)}
            </Tree>
        }

        </Modal>
    )
}

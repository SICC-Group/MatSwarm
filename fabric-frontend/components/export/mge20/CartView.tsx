import React, { FC, useState, useEffect } from 'react';
import { Tree, Icon } from 'antd';
import { Cart } from '../../../utils/ShoppingCart';
import { GetTemplateNames } from '../../../apis/template/GetTemplateNames';
import Urls from '../../../apis/Urls';

export interface Props {
    selected: number[];
    update: (selected: number[], singleTemplate: boolean, templateID: number | null) => void;
}

const TreeNode = Tree.TreeNode;

interface DataListItem {
    id: number;
    title: string;
}

interface TemplateListItem {
    id: number;
    title: string;
    data: DataListItem[];
}

interface ContentProps {
    title: React.ReactNode;
    onDelete: () => void;
}

const TreeNodeContent: FC<ContentProps> = (props) => {
    const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        props.onDelete();
    }
    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
            <div style={{flexGrow: 1, overflow: 'hidden'}}>
                {props.title}
            </div>
            <div style={{flexGrow: 0}}>
                <Icon type="close" onClick={handleClick}/>
            </div>
        </div>
    )
}

export const CartView: FC<Props> = (props) => {
    const [loading, setLoading] = useState(true);
    const [templateList, setTemplateList] = useState<TemplateListItem[]>([]);

    const handleDataSourceChange = () => {
        setLoading(true);
        const tids = Cart.Instance.GetTemplateList();
        GetTemplateNames(...tids).then((value) => {
            const newList = tids.map(tid => ({
                id: tid, title: value.Get(String(tid)), data: Cart.Instance.GetDataList(tid).map(id => ({
                    id: id, title: Cart.Instance.GetDataTitle(id, tid),
                })),
            }))
            setTemplateList(newList);
            setLoading(false);
            const count = new Set<number>();
            const remained = props.selected.filter((dataID) => {
                for (let template of newList) {
                    for (let data of template.data) {
                        if (data.id === dataID) {
                            count.add(template.id);
                            return true;
                        }
                    }
                }
                return false;
            })
            props.update(remained, count.size < 2, count.size === 1 ? count.values().next().value : null);
        })
    }

    useEffect(() => {
        handleDataSourceChange();
    }, []);

    useEffect(() => {
        const add = () => {
            handleDataSourceChange();
        }

        const remove = () => {
            handleDataSourceChange();
        }

        const removeTemplate = () => {
            handleDataSourceChange();
        }
        Cart.Instance.AddOnAddDataListener(add);
        Cart.Instance.AddOnRemoveDataListener(remove)
        Cart.Instance.AddOnRemoveTempalteListener(removeTemplate);

        return () => {
            Cart.Instance.RemoveOnAddDataListener(add);
            Cart.Instance.RemoveOnRemoveDataListener(remove)
            Cart.Instance.RemoveOnRemoveTempalteListener(removeTemplate);
        }
    })

    const handleOnCheck = (keys: string[]) => {
        const tids = keys.filter(v => v.startsWith('t'));
        const dids = keys.filter(v => !v.startsWith('t')).map(Number);
        const tid = tids.length === 1 ? Number(tids[0].slice(1)) : null;
        props.update(dids, tids.length < 2, tid);
    }

    const handleDeleteTemplate = (tid: number) => {
        Cart.Instance.RemoveTemplate(tid);
    }

    const handleDeleteData = (did: number, tid: number) => {
        Cart.Instance.RemoveData(did, tid);
    }

    const handleDataClick = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: number) => {
        e.stopPropagation();
    }

    return (
        <div style={{padding: '0 32px'}}>
            {loading? <div></div> : (
                <Tree onCheck={ handleOnCheck} 
                    blockNode selectable={false}
                    expandedKeys={templateList.map(t => `t${t.id}`)}
                    checkable checkedKeys={props.selected.map(String)}>
                {templateList.map((t) => {
                    const content = <TreeNodeContent title={t.title} onDelete={() => handleDeleteTemplate(t.id)}/>
                    return (
                        <TreeNode title={content} key={`t${t.id}`}>
                            {t.data.map((d) => {
                                const url = (
                                    <a target='_blank' 
                                        style={{display: 'block', overflow: 'hidden', textOverflow: 'ellipsis'}}
                                        href={Urls.storage.show_data(d.id)} onClick={(e) => handleDataClick(e, d.id)}>{Cart.Instance.GetDataTitle(d.id, t.id)}</a>
                                )
                                const dataContent = (
                                    <TreeNodeContent title={url} onDelete={() => handleDeleteData(d.id, t.id)}/>
                                )
                                return <TreeNode title={dataContent} key={String(d.id)} />
                            })}
                        </TreeNode>
                    )
                })}
            </Tree>
            )}
        </div>
    )
}

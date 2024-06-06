import React, { FC, useEffect, useState } from 'react';
import {CreateConvertQuery, QueryConfig} from '../../apis/search/v2/Query';
import '../data/ItemRender.less'

interface Props {
    query: QueryConfig;
}
const test_data =  [
    {
        data_id: 45,
        日期: '2020-04-26 10:57:10',
        单晶id: 45,
        测试id: 45,
        加工id: 45,
    },
    {
        data_id: 46,
        日期: '2020-04-26 10:57:10',
        单晶id: 46,
        测试id: 46,
    },
];

const test_head = [ '日期', '单晶id', '测试id', '加工id'];

export const ExprSearchResult: FC<Props> = (props) => {
    const [panelData, setPanelData ] = useState([]);
    const [panelHead, setPanelHead] = useState([]);
    useEffect(() => {
        CreateConvertQuery(props.query).then((res: any) => {
            setPanelHead(res.data.data.columnArray);
            setPanelData(res.data.data.dataMap);
        });
    }, []);
    let i = 0;
    return(
        <div style={{height: '200%'}}>
            <div style={{width: '80%', margin: '10px auto', overflow: 'scroll', maxHeight: '2000px'}}>
                <table className='table_body'>
                    <thead>
                    <tr className='table_border' style = {{background: '#fff'}}>
                        <td className='table_th' >#</td>
                        {
                            panelHead.map((item: string) => {
                                return <td className='table_td'>{item}</td>
                            })
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        panelData.map((item_tr: any) => {
                            i++;
                            return (
                                <tr className={ i % 2 - 1 ? 'table_body1' : 'table_body0' }>
                                    <td className='table_td_i'>{i}</td>
                                    {
                                        panelHead.map((item_td: any) => {
                                            return <td className='table_td'>{item_tr[item_td]}</td>
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                    </tbody>

                </table>
            </div>
        </div>
    );
};

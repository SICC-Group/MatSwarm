import React, { FC, useState, useEffect } from 'react';
import { Button, Row, Input, Radio, Form } from 'antd';
import Tiff from 'tiff.js'
export interface Props {
    data: any[];
    admin?: boolean;
    visible?: boolean;

}
// function show_prcture(item:any){  //tiff格式图片显示
//     const [baseurl,setbaseurl]=useState('')
//     console.log(item.slice(-3));
//     if(item.slice(-3)==='tif') {    
//     var xhr = new XMLHttpRequest();
//     xhr.responseType = 'arraybuffer';
//      xhr.open('GET', 'http://118.178.121.89:8000'+item);
//      console.log('test', xhr)
//      xhr.onload = function (e) {
//      let tiff = new Tiff({buffer:xhr.response});
//      setbaseurl(tiff.toDataURL());
//      };    
//      xhr.send(); 
//      return(
//         <div style={{textAlign:'right'}}>   
//             <a style={{color:'black'}}>验收专家签字：&nbsp;</a> <img src={baseurl} style={{width:'200px',height:'auto',verticalAlign:'middle',position: 'absolute',right: '0px'}}></img>       
//         </div>
//       );}                       
//       else 
//       return (
//           <div style={{textAlign:'right'}}>
//             <a style={{color:'black'}}>验收专家签字：&nbsp;</a> <img src={'http://118.178.121.89:8000'+item} style={{width:'200px',height:'auto',verticalAlign:'middle'}}></img> 
//           </div>
//        );
// }
export const EvaluationItemViewer: FC<Props> = (props) => {
    return (
        <div style={{ marginBottom: '30px' ,overflowY:'auto'}}>
            {props.data.map((v: any) => {

                return (
                    <div>
                        <form name='VerificationReport1'>
                            <div>
                                <div>评价专家：{v.expert_name}</div>
                                <div className='card_eva' style={{ background: 'white' }}>
                                            <div className='table_row_eva'>
                                                <div className='table_eva' style={{ borderRadius: '8px 0 0 0', width: '10%' }}>序号</div>
                                                <div className='table_eva' style={{ width: '55%' }}>评价条目</div>
                                                <div className='table_eva' style={{ borderRadius: '0 8px 0 0', width: '35%' }}>评价等级</div>
                                            </div>
                                </div>
                                <div>    
                                    {v.items.map((value: any, index: number) => {
                                        return (
                                            <div>
                                                <div className='card_eva'>
                                                    <div className='table_row_eva'>
                                                        <div className='header_left_eva'>{index + 1}</div>
                                                        {value.content === '综合评价' ? (<div className='header_content_eva' style={{ background: '#81BED4', color: 'white' }}>{value.content}</div>)
                                                            : <div className='header_content_eva'>{value.content}</div>}
                                                        <div className='header_content_eva' style={{ width: '35%' }}>
                                                            <div>
                                                                <Radio.Group size='small' style={{ display: 'flex', flexDirection: 'row' }} defaultValue={value.result}>
                                                                    {
                                                                        value.options.map((e: any) => {
                                                                            return (
                                                                                <div className='header_right_eva' > <Radio value={e} disabled={value.result === e ? false : true}>{e}</Radio></div>
                                                                            )
                                                                        })
                                                                    }
                                                                </Radio.Group>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}
                                    <Row>
                                        {/* <Input.TextArea defaultValue={'专家评价数据汇交情况：' + v.comment} rows={4} disabled /> */}
                                        <div>
                                            {'专家评价数据汇交情况：' + v.comment}
                                        </div>
                                    </Row> 
                                    {/* {show_prcture(v.signature)} */}
                                    <div style={{textAlign:'right'}}>
                                       <a style={{color:'black'}}>评价专家签名：&nbsp;</a> <img src={v.signature} style={{width:'200px',height:'auto',verticalAlign:'middle'}}></img>
                                    </div>
                                </div>
                            </div>
                            </form>
                    </div>
                );
            })}
        </div>
    );
};

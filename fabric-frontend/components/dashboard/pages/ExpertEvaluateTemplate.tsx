import React, {FC, useEffect, useState} from 'react';
import {Modal,Table,Button} from 'antd';
import { TEXT } from '../../../locale/Text';
import{GetExpertTemplateScoring,ExpertTemplateScoring,PostExpertTemplateScoring} from '../../../apis/template/Expert_scoring';
import{ExpertTemplateModal}from '../modal/ExpertTemplateModal';
const {Column} = Table
// export interface ExpertEvaluateTemplateProps
// {
//     iscored?:boolean;
// }
export const ExpertEvaluateTemplate: FC<any> =(props) =>{
    const [innerData, setInnerData] = useState<ExpertTemplateScoring[]>([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const[currentid,setCurrentId]=useState(0);
    useEffect(() => {
        setLoading(true)
        GetExpertTemplateScoring(1).then((value:any) => {
            setInnerData(value.results);
            setTotal(value.count);
            setPageSize(pageSize);
            setCurrentPage(value.page);
            setLoading(false);
        })
      }, []);
      const handlePageChange = (page: number) => {
        setLoading(true);
        GetExpertTemplateScoring(page).then((value:any) => {
            console.log(page);
            setInnerData(value.results);
            setTotal(value.count);
            setPageSize(pageSize);
            setCurrentPage(page);
            setLoading(false);
        });

    };
    return (
        <div>
            <Table  dataSource={innerData} loading={loading} pagination={{onChange:(current)=>handlePageChange(current),total: total,pageSize:pageSize, current:currentPage }}style={{marginTop:'50px'}}>
                <Column title={TEXT('dash:ID','模板编号')}  dataIndex="t_id" key="t_id" />
                <Column title={TEXT('dash:title','模板标题')} dataIndex="title" key="title" />
                <Column title={TEXT('dash:acceptance_ID','验收编号')}dataIndex="acceptance_id" key="acceptance_id" />
                <Column title={TEXT('dash:name_ID','项目或课题编号')}dataIndex="ps_id" key="ps_id" />
                <Column title={TEXT('dash:bool_project','是否为项目')}dataIndex="is_project" key="is_project" 
                render={(record)=>{
                    return(
                        <div>{record === true ? TEXT('is_project_true', '是') : TEXT('is_project_false', '否')}</div>
                    )
                }}
                />
                <Column title={TEXT('dash:project_leader','验收项目负责人')} dataIndex="owner" key="owner" />
                <Column title={TEXT('dash:team_leader','验收项目的评价组长')} dataIndex="leader" key="leader" />
                <Column title={TEXT('dash:template_scored','模板是否被打分')} dataIndex="is_scored" key="is_scored"
                render={(value)=>{
                    return(
                        <div>{value=== true ? TEXT('is_project_true', '是') : TEXT('is_project_false', '否')}</div>
                    )
                }}
                />
            <Column
          width='200px'
          title={TEXT('dash:action', '操作')}
          key="action"
          render={(record:ExpertTemplateScoring) => {
            return (
                <div>
                <Button size='small' onClick={() => {window.open('/storage/check_template/' +record.t_id); }}>{TEXT('dash:view_data_list', '查看')}</Button> 
                <Button size='small' onClick={() => {setShowViewModal (true),setCurrentId(record.t_id)}}>{ record.is_scored===true? TEXT('dash:change', '更改'):TEXT('dash:scoring', '打分')}</Button>
                </div>
            )
          }
          }
        />
      </Table>
       <ExpertTemplateModal 
       data={innerData}
        visible={showViewModal}
        onClose={() =>setShowViewModal (false)}
        currentid={currentid}
        />
                </div>
            
     
    )
}
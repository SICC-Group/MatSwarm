// import React, { FC } from 'react';
// import { Table } from 'antd';

// export interface Props<T, FilterType> {
//   // 主键的字段名
//   primaryKey: string;
//   // 主过滤器的值
//   primaryFilters?: FilterType[];
//   // 主过滤器的当前值
//   mainFilterValue: FilterType;
//   // 数据
//   data: T[];
//   // 限制children的类型
//   children: React.ReactElement<ActionTable.ColumnProps> | Array<React.ReactElement<ActionTable.ColumnProps>>;

//   onMainFilterChange: (newValue: FilterType) => void;
// }

// export class ActionTable<T, FilterType> extends React.Component<Props<T, FilterType>> {
//   public render() {
//     React.Children.forEach(this.props.children, (child: React.ReactElement<ActionTable.ColumnProps>, index) => {
//       console.log(child.props);
//     })
//     return (
//       <div>
//         <div style={{ textAlign: 'center', padding: '16px'}}>
          
//         </div>
//         <Table dataSource={this.props.data}>
//         </Table>
//       </div>
      
//     )
//   }
// }

// export namespace ActionTable {

//   export interface ColumnProps {
//     // 是否可以按照此列的值排序
//     sortable?: boolean;
//   }

//   export function Column(props: ColumnProps) { 
//     return <div></div>
//   }

//   export interface FiltersProps {

//   }

//   export function Filters(props: FiltersProps) {

//   }
// }

// function Sample() {
//   const Column = ActionTable.Column;
//   return (
//     <ActionTable data={[1, 2, 3]} primaryKey='id'>
//       <Column sortable/>
//       <Column />
//     </ActionTable>
//   )
// }
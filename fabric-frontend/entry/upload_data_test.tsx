import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import Urls from '../apis/Urls';
import JsonApiFetch from '../apis/Fetch';

import './DataSplicing.less';
export const DataSplicing: FC <any> = () => {
    const CommitData = async (a:number) => {
        const url =  'http://localhost:9001' + Urls.api_v1_1_storage.data_full;
        //模板标题
        const title = '测试mge单条上传数据+++_' + a
        //徐老师意思是用这个做一个测试，测试下分条导入的效率
        //下面这些需要先在创建数据页面手动创建一套数据，然后根据提交成功的那个请求将post上去的json数据复制过来，然后用这个脚本每一次发请求的时候修改一下标题就可以了
        {
        const response = JsonApiFetch(url, 'POST', {
            meta: {
                title: title,
                abstract: "测试",
                doi: "",
                keywords: "测试",
                tid: 2,
                public_range: 0,
                public_date: 0,
                contributor: "",
                institution: "",
    
                source: {
                    source: "10",
                    reference: "",
                    methods: "0001",
                },
                other_info: {
                    project: "2016YFB0700500",
                    subject: "2016YFB0700503",
                },
              category: 2,
              category_name: "测试类别",
              template: {
                    abstract:"test1111",
                    author:null,
                    category:"测试类别",
                    category_id:2,
                    content:'[{"title":"123","required":true,"type":1,"rawtitle":true}]',
                    id:"1",
                    pub_date:"2023-08-05",
                    published:true,
                    ref_count:null,
                    title:"test_ldl",
                    username:null,
                }
            },
            content: "{\"123\":\"1111\"}"
        });
    }//
    }

    const delay = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
    const Com = async () => {
        for(let i =31074; i < 40265; i++){
            await CommitData(i)
            await delay(100);
        }
    }
    return (       
        <div>
            <button onClick={Com}>test</button>
        </div>
    );
};
        
ReactDOM.render(<DataSplicing/>, document.getElementById('wrap'));

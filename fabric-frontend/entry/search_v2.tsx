import React, { FC,Component } from 'react';
import ReactDOM from 'react-dom';

import {Switch, HashRouter as Router, Route } from 'react-router-dom';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { MgeLayout } from '../components/layout/MgeLayout';
import { SearchPage } from '../components/pages/Search';
import {SearchRedirectPage} from '../components/pages/serach_redirect'
import Cookie from 'js-cookie'
import {notification} from 'antd'

class SearchEntry extends Component{

render(){
  return (
    <MgeLayout titleID='search' defaultTitle='搜索'>
      <Breadcrumb items={[Breadcrumb.MGED, Breadcrumb.MDB, Breadcrumb.Search]} />
      <Router>
        {/* <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
          {/* <Route path='/:query_id' exact component={SearchPage} />
          <Route path='/' exact component={SearchPage} /> */}
        {/* </div> */} 
        <Switch>
          <Route path='/querys/data/:id' exact component={SearchRedirectPage} /> 
          <Route path='/:query_id?/:template_id?'  component={SearchPage} />
        </Switch>
      </Router>
    </MgeLayout>
  )
}
}
ReactDOM.render(<SearchEntry />, document.getElementById('wrap'));

import React, { FC,Component } from 'react';
import ReactDOM from 'react-dom';

import {Switch, HashRouter as Router, Route } from 'react-router-dom';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { MgeLayout } from '../components/layout/MgeLayout';
import { SearchPage } from '../components/pages/Search';
import {SearchRedirectPage} from '../components/pages/serach_redirect';
import { FormattedMessage } from 'react-intl';

class ExprSearchResult extends Component{
    render() {
        return(
            <MgeLayout>
                <Breadcrumb items={[Breadcrumb.MGED, Breadcrumb.MDB,{
                    title: <FormattedMessage id={'search:adv_result'} defaultMessage={'高级搜索结果'}/>,
                } ]} />
                <Router>
                    <Switch>
                        <Route path='/querys/data/:id' exact component={SearchRedirectPage} />
                        <Route path='/:query_id?/:template_id?'  component={SearchPage} />
                    </Switch>
                </Router>
            </MgeLayout>
        );
    }
}

ReactDOM.render(<ExprSearchResult />, document.getElementById('wrap'));

import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import Urls from '../apis/Urls';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Container } from '../components/layout/Container';
import { FormPage } from '../components/layout/FormPage';
import { MgeLayout } from '../components/layout/MgeLayout';
import { GlobalInit } from '../utils/global';

import { RawGetData, RawResult } from '../apis/data/Get';
import { DataShow } from '../components/data/DataShow';
GlobalInit();

interface State {
  fetched: boolean;
  title?: string;
  data?: RawResult;
  isPublic?: boolean;     // 是否公开
}

class ShowDataEntry extends Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      fetched: false,
    };
  }

  componentDidMount() {
    const dataID = window.location.search.split('dataID=').pop();
      // const dataID = 2
    RawGetData(dataID).then( value => {
      console.log(value)
      value && this.setState({
        fetched: true,
        // title: '数据详情',
        title: value.title,
        data: value,
        isPublic: !(value + '' === '数据未公开'),
      });
    });
  }

  render() {

    return (
      <MgeLayout reloadOnSwitchLocale titleID='data:detail' defaultTitle='数据详情'>
        <Breadcrumb items={[
          Breadcrumb.MGED,Breadcrumb.MDB,
          {
            title: <FormattedMessage id='data:detail' defaultMessage='数据详情' />,
          }
        ]} />

        <Container>
          <FormPage title={this.state.fetched ? this.state.title : <FormattedMessage id='data:detail' defaultMessage='数据详情' />}>
            {
              this.state.fetched ? (
                <div>
                  {
                    this.state.isPublic ? (
                      <div>
                        <DataShow data={this.state.data!} />

                      </div>
                    ) : (
                        <h1 style={{textAlign:"center",marginTop:'10px'}}>数据未公开</h1>
                    )
                  }
                </div>
              ) : (
                  <div style={{ flex: 'auto' }} />
                )
            }
          </FormPage>
        </Container>
      </MgeLayout>
    );
  }
}

ReactDOM.render(<ShowDataEntry />, document.getElementById('wrap'));

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Carousel, notification } from 'antd';

import Urls from '../apis/Urls';
import { MgeLayout } from '../components/layout/MgeLayout';
import { EntryItem } from '../components/index/EntryItem';
import { EntryWrapper } from '../components/index/EntryWrapper';
import { CarouselWrapper } from '../components/index/CarouselWrapper';
import { SwitchButton } from '../components/index/SwitchButton';
import { Line } from '../components/index/line';
import { Banner } from '../components/index/Banner';

const btn1 = require('../img/btn1.png');
const btn2 = require('../img/btn2.png');
const btn3 = require('../img/btn3.png');
const btn4 = require('../img/btn4.png');
const xrd = require('../img/xrd.png');
const mtm = require('../img/mtm.png');

import Cookie from 'js-cookie';

class IndexEntry extends Component {

  private slider?: Carousel;

  componentDidMount() {

  }

  render() {
    return (
      <MgeLayout indexOnly titleID='MGED' defaultTitle='材料基因工程专用数据库'>
        <Banner />
        <CarouselWrapper>
          <SwitchButton position='left' onClick={() => { if (this.slider) this.slider.prev() }} />
          <SwitchButton position='right' onClick={() => { if (this.slider) this.slider.next() }} />
          <Line />
          <Carousel ref={(ref) => { this.slider = ref! }} autoplay dots={false}>
            <div>
              <EntryWrapper>
                <EntryItem
                  img={btn3}
                  url={Urls.search.index}
                  titleEn='Materials Database'
                  titleZh='材料数据库' />
              </EntryWrapper>
            </div>
          </Carousel>
        </CarouselWrapper>
      </MgeLayout>
    );
  }
}

ReactDOM.render(<IndexEntry />, document.getElementById('wrap'));

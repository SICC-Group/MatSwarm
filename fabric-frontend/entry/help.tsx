import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';

import { Anchor } from 'antd';

import Urls from '../apis/Urls';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { MgeLayout } from '../components/layout/MgeLayout';
import { MenuKey } from '../components/layout/NavMenu';

import './help.less';
import { MediaPrefix as mediaPrefix } from '../apis/MediaPrefix';

const { Link } = Anchor;

const breadcrumbItems: BreadcrumbItem = 
  {
    title: <FormattedMessage id='help' defaultMessage='帮助' />,
  }


const t_StartUsing = <FormattedMessage id='help:start_using' defaultMessage='开始使用' />;
const t_RegisterAccount = <FormattedMessage id='help:register_account' defaultMessage='注册账号' />;
const t_Login = <FormattedMessage id='help:login' defaultMessage='登录账号' />;
const t_PersonalSet = <FormattedMessage id='help:personal_settings' defaultMessage='个人设置' />;
const t_Home = <FormattedMessage id='help:home' defaultMessage='首页' />;
const t_Temp = <FormattedMessage id='help:template' defaultMessage='模板' />;
const t_TempIntro = <FormattedMessage id='help:template_intro' defaultMessage='模板介绍' />;
const t_TempMod = <FormattedMessage id='help:template_mod' defaultMessage='模板修改' />;
const t_Upload = <FormattedMessage id='help:upload' defaultMessage='上传数据' />;
const t_FormSub = <FormattedMessage id='help:form_sub' defaultMessage='表单提交' />;
const t_FileSub = <FormattedMessage id='help:file_sub' defaultMessage='文件提交' />;
const t_Stat = <FormattedMessage id='help:stat' defaultMessage='数据统计' />;
const t_Search = <FormattedMessage id='help:search' defaultMessage='数据检索' />;
const t_AdvSearch = <FormattedMessage id='help:adv_search' defaultMessage='高级检索' />;
const t_Service = <FormattedMessage id='help:data_service' defaultMessage='数据服务' />;
const t_Field = <FormattedMessage id='help:field_type' defaultMessage='字段类型' />;

class HelpEntry extends Component {
  render() {
    return (
      <MgeLayout selectedMenu={MenuKey.Help} contentStyle={{ flexDirection: 'column', display: 'flex' }}>
        <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems]} />

        <div>
          <div className='Body' id='start'>
            <div className='Body__blue'>
              <div className='Body__blue__title'>
                {t_StartUsing}
              </div>
            </div>
            <div style={{fontSize:'20px' ,marginLeft:'20px',marginTop:'20px' }}>
              <a  href='https://www.yuque.com/docs/share/7e29faf6-4a80-4c8d-af16-16e67d3250c6' target='_blank'>
                <FormattedMessage id='user_manual' defaultMessage='数据汇交验收使用手册'/>
              </a>
            </div>
            <div className='Body__title' id='register'>{t_RegisterAccount}</div>
            <div className='Body__title1'>
              <FormattedMessage id='help:_1' />
            </div>
            <div className='Body__image'><img src={`${mediaPrefix}_docs/img/help/register.png`} width='204'></img></div>
            <div>
              <div className='Body__title_careful'>
                <FormattedMessage id='help:_2' />
              </div>
              <div className='Body__body' >
                <ul>
                  <li><FormattedMessage id='help:_3' /></li>
                  <li><FormattedMessage id='help:_4' /></li>
                  <li><FormattedMessage id='help:_5' /></li>
                  <li><FormattedMessage id='help:_6' /></li>
                </ul>
              </div>
            </div>
          </div>

          <div className='Anchor'>
            <Anchor>
              <Link href='#start' title={t_StartUsing}>
                <Link href='#register' title={t_RegisterAccount} />
                <Link href='#login' title={t_Login} />
                <Link href='#setting' title={t_PersonalSet} />
                <Link href='#index' title={t_Home} />
              </Link>

              <Link href='#tem' title={t_Temp}>
                <Link href='#introduction' title={t_TempIntro} />
                <Link href='#modify' title={t_TempMod} />
              </Link>

              <Link href='#upload' title={t_Upload} />
              <Link href='#analytics' title={t_Stat} />
              <Link href='#search' title={t_Search} />
              <Link href='#service' title={t_Service} />
              <Link href='#type' title={t_Field} />
            </Anchor>
          </div>
        </div>
        <div className='Body_denglu' id='login'>
          <div className='Body_denglu__title'>{t_Login}</div>
          <div className='Body_denglu__body'>
            <div className='Body_denglu__body__image'><img src={`${mediaPrefix}_docs/img/help/denglu.png`} width='191'></img></div>
            <div className='Body_denglu__body__image1'><img src={`${mediaPrefix}_docs/img/help/chongzhi.png`} width='230'></img></div>
            <div className='Body_denglu__body__title_careful'>
              <FormattedMessage id='help:_7' /><br />
              <FormattedMessage id='help:_8' /><br />
            </div>
            <div className='Body_denglu__body__text' >
              ●  <FormattedMessage id='help:_9' /><br />
              ●  <FormattedMessage id='help:_10' /><br />
              {/*●  <FormattedMessage id='help:_11' /><br />*/}
              ●  <FormattedMessage id='help:_12' /><br />
              {/*●  <FormattedMessage id='help:_13' /><br />*/}
              ●  <FormattedMessage id='help:_14' /><br />
            </div>
          </div>
        </div>

        <div className='Body_geren' id='setting'>
          <div className='Body_geren__title'>{t_PersonalSet}</div>
          <div className='Body_denglu__body'>
            <div className='Body_geren__body__image'><img src={`${mediaPrefix}_docs/img/help/shezhi.png`} width='457'></img></div>
            <div className='Body_geren__body__image1'><img src={`${mediaPrefix}_docs/img/help/shezhi1.png`} width='435'></img></div>
          </div>
          <div className='Body_geren__body__title_careful'>
            <FormattedMessage id='help:_15' /><br />
            <FormattedMessage id='help:_16' /><br />
          </div>
        </div>

        <div className='TitleBlue' id='index'>
          <div className='TitleBlue__title'>{t_Home}</div>
        </div>
        <div className='Body_shouye'>
          <div className='Body_shouye__image1'><img src={`${mediaPrefix}_docs/img/help/shouye1.png`} width='511' ></img></div>
          <div className='Body_shouye__title_careful1'>
            <FormattedMessage id='help:_17' /><br />
          </div>
        </div>

        <div className='TitleBlue' id='tem'>
          <div className='TitleBlue__title'>{t_Temp}</div>
        </div>
        <div className='Body_mubanjieshao' id='introduction'>
          <div className='Body_mubanjieshao__title'>{t_TempIntro}</div>
          <div className='Body_mubanjieshao__image'><img src={`${mediaPrefix}_docs/img/help/mubanjieshao.png`} width='545'></img></div>
          <div className='Body_mubanjieshao__title_careful'>
            <FormattedMessage id='help:_19' /><br />
            <FormattedMessage id='help:_20' />
          </div>
          <div className='Clear'></div>
          <div className='Body_mubanjieshao__image1'><img src={`${mediaPrefix}_docs/img/help/mubanjieshao1.png`} width='556'></img></div>
          <div className='Body_mubanjieshao__title_careful1'>
            <FormattedMessage id='help:_21' /><br />
          </div>
          <div className='Body_mubanjieshao__text'>
            ●  <FormattedMessage id='help:_22' /><br />
            ●  <FormattedMessage id='help:_23' /><br />
          </div>
        </div>

        <div className='Body_xiugaimuban' id='modify'>
          <div className='Body_xiugaimuban__title'>{t_TempMod}</div>
          <div className='Body_xiugaimuban__image1'><img src={`${mediaPrefix}_docs/img/help/xiugaimuban.png`} width='581'></img></div>
          <div className='Body_xiugaimuban__title_careful1'>
            <FormattedMessage id='help:_24' /><br />
            <FormattedMessage id='help:_25' /><br />
          </div>
          <div className='Body_xiugaimuban__text'>
            ●  <FormattedMessage id='help:_26' /><br />
          </div>
          <div className='Clear'></div>
        </div>

        <div className='TitleBlue' id='upload'>
          <div className='TitleBlue__title'>{t_Upload}</div>
        </div>
        <div className='Body_shangchuanshuju'>
          <div className='Body_shangchuanshuju__title_careful'>
            <FormattedMessage id='help:_27' />
          </div>
          <div className='Body_shangchuanshuju__text'>
            ●  <FormattedMessage id='help:_28' /><br />
            ●  <FormattedMessage id='help:_29' /><br />
            ●  <FormattedMessage id='help:_30' /><br />
            ●  <FormattedMessage id='help:_31' /><br />
          </div>
          <div className='Body_shangchuanshuju__title_careful'>
            <FormattedMessage id='help:_32' />
          </div>
          <div className='Body_shangchuanshuju__text'>
            <FormattedMessage id='help:_33' />
          </div>
        </div>

        <div className='Body_biaodan'>
          <div className='Body_biaodan__title'>{t_FormSub}</div>

          <div className='Body_biaodan__title_careful'>
            <FormattedMessage id='help:_34' />
          </div>
          <div className='Body_biaodan__image'><img src={`${mediaPrefix}_docs/img/help/biaodan.png`} width='668'></img></div>
        </div>

        <div className='Body_shangchuanshuju'>
          <div className='Body_shangchuanshuju__title'>{t_FileSub}</div>
          <div className='Body_shangchuanshuju__title_careful'>
            <FormattedMessage id='help:_35' /><br />
            <FormattedMessage id='help:_36' />
          </div>
          <div className='Body_shangchuanshuju__title_careful'>
            <FormattedMessage id='help:_37' />
          </div>
          <div className='Body_shangchuanshuju__text'>
            ●  <FormattedMessage id='help:_38' /><br />
            ●  <FormattedMessage id='help:_39' /><br />
            ●  <FormattedMessage id='help:_40' /><br />
            ●  <FormattedMessage id='help:_41' /><br />
            ●  <FormattedMessage id='help:_42' /><br />
            ●  <FormattedMessage id='help:_43' /><br />
            ●  <FormattedMessage id='help:_44' /><br />
          </div>
          <div className='Body_shangchuanshuju__title_careful'>
            <FormattedMessage id='help:_45' />
          </div>
          <div className='Body_shangchuanshuju__text'>
            ●  <FormattedMessage id='help:_46' /><br />
            ●  <FormattedMessage id='help:_47' /><br />
          </div>
          <div className='Body_shangchuanshuju__title_careful'>
            <FormattedMessage id='help:_48' />
          </div>
        </div>
        <div className='Body_xiugaishuju'>
          <div className='Body_xiugaishuju__title'><FormattedMessage id='help:_49' /></div>
          <div className='Body_xiugaishuju__image'><img src={`${mediaPrefix}_docs/img/help/xiugaishuju.png`} width='510'></img></div>
          <div className='Body_xiugaishuju__title_careful'>
            <FormattedMessage id='help:_50' /><br />
            <FormattedMessage id='help:_51' /><br />
          </div>
        </div>
        <div className='TitleBlue' id='analytics'>
          <div className='TitleBlue__title'>{t_Stat}</div>
        </div>
        <div className='Body_mubanjieshao'>
          <div className='Body_mubanjieshao__image2'><img src={`${mediaPrefix}_docs/img/help/shujutongji.png`} width='513'></img></div>
          <div className='Body_mubanjieshao__title_careful3'>
            <FormattedMessage id='help:_52' /><br />
            <FormattedMessage id='help:_53' /><br />
            <FormattedMessage id='help:_54' />
          </div>
          <div className='Clear'></div>
          <div className='Body_mubanjieshao__image2'><img src={`${mediaPrefix}_docs/img/help/shujutongji1.png`} width='513'></img></div>
          <div className='Body_mubanjieshao__title_careful2'>
            <FormattedMessage id='help:_55' /><br />
          </div>
          <div className='Clear'></div>
          <div className='Body_mubanjieshao__image2'><img src={`${mediaPrefix}_docs/img/help/shujutongji2.png`} width='513'></img></div>
          <div className='Body_mubanjieshao__title_careful2'>
            <FormattedMessage id='help:_56' /><br />
          </div>
        </div>

        <div className='TitleBlue' id='search'>
          <div className='TitleBlue__title'>{t_Search}</div>
        </div>
        <div className='Body'>
          <div className='Body__title'><FormattedMessage id='help:_57' /></div>
          <div className='Body__title_careful1'><FormattedMessage id='help:_58' /></div>
        </div>

        <div className='Body_gaojijiansuo'>
          <div className='Body_gaojijiansuo__title'>
            {t_AdvSearch}<br />
          </div>
          <div className='Body_gaojijiansuo__title_careful'>
            <FormattedMessage id='help:_59' />
          </div>
          <div className='Body_gaojijiansuo__image2'><img src={`${mediaPrefix}_docs/img/help/jiansuo.png`} width='521'></img></div>
          <div className='Body_gaojijiansuo__title_careful1'>
            <FormattedMessage id='help:_60' />
          </div>
          <div className='Body_gaojijiansuo__text'>
            <FormattedMessage id='help:_61' /><br />
            <FormattedMessage id='help:_62' />
          </div>
          <div className='Clear'></div>
          <div className='Body_gaojijiansuo__image2'><img src={`${mediaPrefix}_docs/img/help/jiansuo1.png`} width='521'></img></div>
          <div className='Body_gaojijiansuo__title_careful2'>
            <FormattedMessage id='help:_63' />
          </div>
          <div className='Body_gaojijiansuo__text'>
            <FormattedMessage id='help:_64' /><br />
            <FormattedMessage id='help:_65' />
          </div>
          <div className='Clear'></div>
          <div className='Body_gaojijiansuo__image2'><img src={`${mediaPrefix}_docs/img/help/jiansuo2.png`} width='521'></img></div>
          <div className='Body_gaojijiansuo__title_careful2'>
            <FormattedMessage id='help:_66' />
          </div>
          <div className='Body_gaojijiansuo__text'>
            <FormattedMessage id='help:_67' />
          </div>
        </div>

        <div className='TitleBlue' id='service'>
          <div className='TitleBlue__title'>{t_Service}</div>
        </div>
        <div className='Body_shujufuwu'>
          <div className='Body_shujufuwu__title_careful'>
            <FormattedMessage id='help:_68' />
          </div>
          <div className='Body_shujufuwu__title_careful'><FormattedMessage id='help:_69' /></div>
          <div className='Body_shujufuwu__text'>
            ●  <FormattedMessage id='help:_70' /><br />
            ●  <FormattedMessage id='help:_71' /><br />
            ●  <FormattedMessage id='help:_72' /><br />
          </div>
          <div className='Body_shujufuwu__title_careful'><FormattedMessage id='help:_98' /></div>
          <div className='Body_shujufuwu__text'>
            ●  <FormattedMessage id='help:_73' /><br />
            ●  <FormattedMessage id='help:_74' /><br />
          </div>
          <div className='Body_shujufuwu__title_careful'><FormattedMessage id='help:_75' /></div>
          <div className='Body_shujufuwu__image'><img src={`${mediaPrefix}_docs/img/help/fuwu.png`} width='521'></img></div>
          <div className='Body_shujufuwu__title_careful1'>

            <FormattedMessage id='help:_76' />
          </div>
          <div className='Clear'></div>
          <FormattedMessage id='help:_77' />
        </div>

        <div className='TitleBlue' id='type'>
          <div className='TitleBlue__title'>{t_Field}</div>
        </div>
        <div className='Body_zifuleixing'>
          <div className='Body_zifuleixing__title_careful'>
            <FormattedMessage id='help:_78' />
          </div>
          <div className='Body_zifuleixing__text'>
            <FormattedMessage id='help:_79' />
          </div>

          <div className='Body_zifuleixing__title_careful'>
            <FormattedMessage id='help:_80' />
          </div>
          <div className='Body_zifuleixing__text'>
            <FormattedMessage id='help:_81' />
          </div>

          <div className='Body_zifuleixing__title_careful'>
            <FormattedMessage id='help:_82' />
          </div>
          <div className='Body_zifuleixing__text'>
            <FormattedMessage id='help:_83' />
          </div>

          <div className='Body_zifuleixing__title_careful'>
            <FormattedMessage id='help:_84' />
          </div>
          <div className='Body_zifuleixing__text'>
            <FormattedMessage id='help:_85' />
          </div>

          <div className='Body_zifuleixing__title_careful'>
            <FormattedMessage id='help:_86' />
          </div>
          <div className='Body_zifuleixing__text'>
            <FormattedMessage id='help:_87' />
          </div>

          <div className='Body_zifuleixing__title_careful'>
            <FormattedMessage id='help:_88' />
          </div>
          <div className='Body_zifuleixing__text'>
            <FormattedMessage id='help:_89' />
          </div>

          <div className='Body_zifuleixing__title_careful'>
            <FormattedMessage id='help:_90' />
          </div>
          <div className='Body_zifuleixing__text'>
            <FormattedMessage id='help:_91' />
          </div>

          <div className='Body_zifuleixing__title_careful'>
            <FormattedMessage id='help:_92' />
          </div>
          <div className='Body_zifuleixing__text'>
            <FormattedMessage id='help:_93' />
          </div>
          <div className='Body_zifuleixing__title_careful'>
            <FormattedMessage id='help:_94' />
          </div>
          <div className='Body_zifuleixing__text'>
            <FormattedMessage id='help:_95' />
          </div>

          <div className='Body_zifuleixing__title_careful'>
            <FormattedMessage id='help:_96' />
          </div>
          <div className='Body_zifuleixing__text'>
            <FormattedMessage id='help:_97' />
          </div>
        </div>

      </MgeLayout>
    );
  }
}

ReactDOM.render(<HelpEntry />, document.getElementById('wrap'));

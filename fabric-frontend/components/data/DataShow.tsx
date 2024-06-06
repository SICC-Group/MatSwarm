import { Button, Checkbox, Icon, Modal, Spin } from 'antd';
import { autobind } from 'core-decorators';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { ApproveData, DisApproveData } from '../../apis/data/ApproveData';
import { DeletData } from '../../apis/data/Delet';
import { RawResult } from '../../apis/data/Get';
import { UserInfo } from '../../apis/define/User';
import { ExportData } from '../../apis/export/ExportData';
import { Info } from '../../apis/session/Info';
import {Urls} from '../../apis/Urls';
import {TEXT} from '../../locale/Text';
import { Translate } from '../../locale/translate';
import { Cart } from '../../utils/ShoppingCart';
import { ItemRender } from './ItemRender';

import './DataShow.less';

const t_CreatedAt = <FormattedMessage id='dataShow:created_at' defaultMessage='创建时间' />;
const t_Abstract = <FormattedMessage id='dataShow:abstract' defaultMessage='数据摘要' />;
const t_Keywords = <FormattedMessage id='dataShow:keywords' defaultMessage='关键词' />;
const t_ReviewState = <FormattedMessage id='dataShow:review_state' defaultMessage='数据状态' />;
const t_Author = <FormattedMessage id='dataShow:author' defaultMessage='提交者' />;
const t_subject_name = <FormattedMessage id='dataShow:subject_name' defaultMessage='课题名称'/>;
const t_subject_number = <FormattedMessage id='dataShow:subject_number' defaultMessage='课题编号'/>;
const t_Contributor = <FormattedMessage id='dataShow:contributor' defaultMessage='数据生产者' />;
const t_ResponsibleInstitution = <FormattedMessage id='dataShow:responsible_institution' defaultMessage='数据生产机构' />;
const t_DataContributorInstitution = <FormattedMessage id='dataShow:data_contributor_institution' defaultMessage='数据提交者机构' />;
const t_TemplateName = <FormattedMessage id='dataShow:template_name' defaultMessage='模板名' />;
const t_Reviewer = <FormattedMessage id='dataShow:reviewer' defaultMessage='审核人' />;
const t_RealName = <FormattedMessage id='dataShow:real_name' defaultMessage='姓名' />;
const t_Institution = <FormattedMessage id='dataShow:institution' defaultMessage='单位' />;
const t_ReasonsOfDisapproval = <FormattedMessage id='dataShow:reasons_of_disapproval' defaultMessage='不通过理由' />;
const t_Content = <FormattedMessage id='dataShow:content' defaultMessage='数据内容' />;
const t_OtherInfo = <FormattedMessage id='dataShow:other_info' defaultMessage='其他信息' />;
const t_Source = <FormattedMessage id='dataShow:source' defaultMessage='来源' />;
const t_Reference = <FormattedMessage id='dataShow:reference' defaultMessage='引用' />;
const t_NA = <FormattedMessage id='dataShow:N/A' defaultMessage='无' />;
const t_Method = <FormattedMessage id='dataShow:method' defaultMessage='方法' />;
const t_Approve = <FormattedMessage id='dataShow:approve' defaultMessage='通过' />;
const t_DisApprove = <FormattedMessage id='dataShow:disApprove' defaultMessage='不通过' />;
const t_PendingReview = <FormattedMessage id='dataShow:pendingReview' defaultMessage='等待审核' />;
const t_SelfProduction = <FormattedMessage id='dataShow:selfProduction' defaultMessage='自产' />;
const t_DisReason = <FormattedMessage id='dataShow:DisReason' defaultMessage='请选择拒绝通过的理由：' />;
const t_DisReason1 = <FormattedMessage id='dataShow:DisReason1' defaultMessage='缺少元数据' />;
const t_DisReason2 = <FormattedMessage id='dataShow:DisReason2' defaultMessage='缺少计算或实验条件' />;
const t_DisReason3 = <FormattedMessage id='dataShow:DisReason3' defaultMessage='缺少计算或实验条件' />;
const t_DisReason4 = <FormattedMessage id='dataShow:DisReason4' defaultMessage='缺少性能信息' />;
const t_DisReason5 = <FormattedMessage id='dataShow:DisReason5' defaultMessage='标题不规范' />;
const t_DisReason6 = <FormattedMessage id='dataShow:DisReason6' defaultMessage='缺少引用信息' />;
const t_DisReason7 = <FormattedMessage id='dataShow:DisReason7' defaultMessage='数据收集、审核人信息不全' />;

const ButtonGroup = Button.Group;
const { confirm } = Modal;
const cart = Cart.Instance;

// 数据的审核状态 
function ShowReviewState(props: { review_state: number}) {
  if (props.review_state === 1) {
    return (
        <div className='approved'>
          <div className='pending_review_font'>
            <Icon type='check' /> {t_Approve}
          </div>
        </div>
    );
  } else if (props.review_state === 2) {
    return (
        <div className='disapproved'>
          <div className='pending_review_font'>
            <Icon type='close' /> {t_DisApprove}
          </div>
        </div>
    );
  } else {
    if (props.review_state === 0) {
      return (
          <div className='pending_review'>
            <div className='pending_review_font'>
              <Icon type='exclamation-circle' />{t_PendingReview}
            </div>
          </div>
      );
    }
  }
}
// 数据来源
function ShowSource(props: { source: string}) {
  if (props.source === 'self-production') {
    return (
        <div>
          {t_SelfProduction}
        </div>   
    );
  }
  else if (props.source === 'reference') {
    return (  
        <div>
          {t_Reference}
        </div>
    );
  }
  return(<div></div>);
}

function ShowReference(props: { data: RawResult}){
  const description = TEXT('dataShow:description', '为尊重知识产权、保障数据生产者和服务者的权益，请数据使用者在基于本数据所产生的研究成果（包括项目报告、学术论文或者毕业论文等）中以标准格式进行数据引用和致谢：');

  const reference_CN = (props.data.doi == null) ? '国家材料基因工程数据汇交与管理服务平台.' + props.data.title + '。' : '国家材料基因工程数据汇交与管理服务平台.' + props.data.title + '。' + 'DOI:' + props.data.doi + '.';
  const reference_EN = (props.data.doi == null) ? 'National Materials Genome Engineering Data Collection and Management Service Platform.' + props.data.title + '。' : 'National Materials Genome Engineering Data Collection and Management Service Platform.' + props.data.title + '。' + 'DOI:' + props.data.doi + '.';
  const reference_PF = 'Liu, S., Su, Y., Yin, H. et al. An infrastructure with user-centered presentation data model for integrated management of materials data and services. npj Comput Mater 7, 88 (2021). https://doi.org/10.1038/s41524-021-00557-x';
  const acknowledgements_CN = '感谢“' + props.data.project_name + '”项目(' + props.data.project + ')和国家材料基因工程数据汇交与管理服务平台（http://nmdms.ustb.edu.cn/）提供数据资源。';
  const acknowledgements_EN = 'We acknowledge for the data source from \'' + props.data.project_name + '\'(' + props.data.project + ') and "National Materials Genome Engineering Data Collection and Management Service Platform"(http://nmdms.ustb.edu.cn/).';
  return (
      <div>
        <h5>{description}</h5>
        <h5>{TEXT('dataShow:reference_CN', '中文引用：')}{reference_CN}</h5>
        <h5>{TEXT('dataShow:reference_EN', '英文引用：')}{reference_EN}</h5>
        <h5>{TEXT('dataShow:reference_PF', '平台引用：')}{reference_PF}</h5>
        <h5>{TEXT('dataShow:acknowledgements_CN', '中文致谢：')}{acknowledgements_CN}</h5>
        <h5>{TEXT('dataShow:acknowledgements_EN', '英文致谢：')}{acknowledgements_EN}</h5>

      </div>

  );
}

// 审核信息
function ShowReviewInf(props: { data: RawResult}) {
  if (props.data.review_state === 1) {
    return (
        <div>
          <div className='dividing_line'> </div>
          <h3>{t_Reviewer}</h3>
          <div className='meta' >
            <div className='meta_left'>{t_RealName}</div>
            <div className='meta_right'>{props.data.reviewer || t_NA}</div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_Institution}</div>
            <div className='meta_right'>{props.data.reviewer_ins || t_NA}</div>
          </div>
        </div>
    );
  } else if (props.data.review_state === 2) {
    return (
        <div>
          <div className='dividing_line'> </div>
          <h3>{t_Reviewer}</h3>
          <div className='meta' >
            <div className='meta_left'>{t_RealName}</div>
            <div className='meta_right'>{props.data.reviewer || t_NA} </div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_Institution}</div>
            <div className='meta_right'>{props.data.reviewer_ins || t_NA}   </div>
          </div>
          {/* <div className='meta' >
            <div className='meta_left'>电子邮件</div>
            <div className='meta_right'>   </div>
          </div> */}
          <div className='meta' >
            <div className='meta_left'>{t_ReasonsOfDisapproval}</div>
            <div className='meta_right_red'>{props.data.disapprove_reason || t_NA}</div>
          </div>
        </div>
    );
  } else{
    return(
      <div></div>
    );
  }
}

interface DataProps {
  data: RawResult;
  is_20 ?: boolean;
}
interface DataStates {
  data_in: boolean;
  url_get: boolean;
  file_JSON: string;
  file_XML: string;
  file_XLSX: string;
  disapprove_data: boolean;
  disapprove_reasons: number[];
  disapprove_bool: boolean[];
  user_info ?: UserInfo;
  user_info_get: boolean;
  can_review: boolean;
  can_edit: boolean;
  flag: boolean; // 用于渲染优化的变量
}

export class DataShow extends Component<DataProps, DataStates> {
  constructor(props: DataProps) {
    super(props);

    const data_id = this.props.data.id;
    let data_in_con = false;
    const cart = Cart.Instance;
    const data_list = cart.GetDataList(props.data.template.id);
    if (!data_list) {
      data_in_con = false;
    } else {
      for (let i = 0; i < data_list.length; i++) {
        if (data_list[i] === data_id) {
          data_in_con = true;
        }
      }
    }
    this.state = {
      data_in: data_in_con,
      file_JSON: '',
      file_XML: '',
      file_XLSX: '',
      url_get: false,
      disapprove_data: false,
      disapprove_reasons: [],
      disapprove_bool: [false, false, false, false, false, false, false],
      user_info_get: false,
      can_review: false,
      can_edit: false,
      flag: false, // 用于渲染优化的变量
    };
  }

  componentDidMount() {
    let user_info: UserInfo = null;
    let user_info_get = false;
    let can_review = false;
    let can_edit = false;
    Info().then((value) => {
      if (value){
        this.setState({
          user_info: value,
          user_info_get: true,
        });
        user_info = value;
        user_info_get = true;
        for (let i = 0; i < this.state.user_info.managed_categories.length; i++) {
          if (this.state.user_info.managed_categories[i].id === this.props.data.template.category_id) {
            this.setState({
              can_review: true,
            });
            can_review = true
          }
        }
        if (this.state.user_info.real_name === this.props.data.author){
          this.setState({
            can_edit: true,
          });
          can_edit = true
        }
      }
      this.setState({
        flag: true
      })
    });
  }

  shouldComponentUpdate(nextProps: Readonly<DataProps>, nextState: Readonly<DataStates>, nextContext: any): boolean {
    return nextState.flag
  }

  @autobind
  onCheckJSON() {
    this.setState({
      file_JSON: 'loading',
    });
    const dataList = [String(this.props.data.id)];
    ExportData('JSON', dataList, false).then((value) => {
      this.setState({
        file_JSON: '',
      });
    });
  }
  @autobind
  onCheckXML() {
    this.setState({
      file_XML: 'loading',
    });
    const dataList = [String(this.props.data.id)];
    ExportData('XML', dataList, false).then((value) => {
      this.setState({
        file_XML: '',
      });
    });
  }
  @autobind
  onCheckXLSX() {
    this.setState({
      file_XLSX: 'loading',
    });
    const dataList = [String(this.props.data.id)];
    ExportData('XLSX', dataList, false).then((value) => {
      this.setState({
        file_XLSX: '',
      });
    });
  }

  @autobind
  addData() {
    cart.AddData(this.props.data.id, this.props.data.title, this.props.data.tid);
    this.setState({ data_in: true });
    console.log(this.props, this.state);
  }
  @autobind
  removeData() {
    cart.RemoveData(this.props.data.id, this.props.data.template.id);
    this.setState({ data_in: false });
  }

  @autobind
  approve(){
    ApproveData(this.props.data.id);
    Modal.success({
      title: Translate('dataShow:Success'),
        content: Translate('dataShow:SuccessApp'),
      onOk() {
        window.location.reload();
      },
      // onCancel() {},
    });
  }
  @autobind
  disapprove(){
    this.setState({
      disapprove_data: true,
    });
  }

  @autobind
  handleOk(){
    const reason = [];
    let modify_state = false;
    for (let i = 0; i < this.state.disapprove_bool.length; i++) {
      if (this.state.disapprove_bool[i]) {
        reason.push(i + 1);
        modify_state = true;
      }
    }
    this.setState({
      disapprove_reasons: reason,
      disapprove_data: false,
      
    });
    if (!modify_state) {
      alert(Translate('dataShow:Alert') );
    } else {
      DisApproveData(this.props.data.id, reason);
      window.location.reload();
    }
  }

  handleCancel = (e: any) => {
    this.setState({
      disapprove_data: false,
    });
  }
  @autobind
  disapprove_reason1(){
    const reasons = this.state.disapprove_bool;
    reasons[0] = !reasons[0];
    console.log(reasons);
    this.setState({
      disapprove_bool: reasons,
    });
  }@autobind
  disapprove_reason2(){
    const reasons = this.state.disapprove_bool;
    reasons[1] = !reasons[1];
    console.log(reasons);
    this.setState({
      disapprove_bool: reasons,
    });
  }@autobind
  disapprove_reason3(){
    const reasons = this.state.disapprove_bool;
    reasons[2] = !reasons[2];
    console.log(reasons);
    this.setState({
      disapprove_bool: reasons,
    });
  }@autobind
  disapprove_reason4(){
    const reasons = this.state.disapprove_bool;
    reasons[3] = !reasons[3];
    console.log(reasons);
    this.setState({
      disapprove_bool: reasons,
    });
  }@autobind
  disapprove_reason5(){
    const reasons = this.state.disapprove_bool;
    reasons[4] = !reasons[4];
    console.log(reasons);
    this.setState({
      disapprove_bool: reasons,
    });
  }@autobind
  disapprove_reason6(){
    const reasons = this.state.disapprove_bool;
    reasons[5] = !reasons[5];
    console.log(reasons);
    this.setState({
      disapprove_bool: reasons,
    });
  }@autobind
  disapprove_reason7(){
    const reasons = this.state.disapprove_bool;
    reasons[6] = !reasons[6];
    console.log(reasons);
    this.setState({
      disapprove_bool: reasons,
    });
  }

  @autobind
  edit_data(){
    // let data_add = Urls.storage.add_data;
    // let data_url = data_add + '?action=modify&did=';
    // let data_id = this.props.data.id;
    // data_url = data_url + data_id;
    const data_url = Urls.storage.edit_data_new +  this.props.data.id;
    window.open(data_url);
  }
  @autobind
  delete_data(){
    const data_id = this.props.data.id;
    confirm({
      title: Translate('dataShow:Delete'),
      content: Translate('dataShow:DeleteData'),
      onOk() {
        DeletData(data_id);
        window.open(Urls.search.index);
      },
      onCancel() {},
    });
  }

  render() {
    let Message_can_review = (null);
    let Message_can_review1 = (null);
    let Message_can_edit = (null);
    let Message_can_edit1 = (null);
    if  (this.state.can_review && this.props.data.review_state === 0 ){
      Message_can_review = (
      <Button onClick={this.approve} className='ApproveData'>{t_Approve}</Button>  
      );
      Message_can_review1 = (
      <Button onClick={this.disapprove} className='DisapproveData'>{t_DisApprove}</Button>
      );
    }
    if  (this.state.can_edit){
      Message_can_edit = (
        <Button onClick={this.edit_data}><i className='fa fa-pencil' aria-hidden='true' /></Button> 
      );
      Message_can_edit1 = (
        <Button onClick={this.delete_data}><Icon type='delete' /></Button>
      );
    }
    return (
      <div className='page_body'>
                    {console.log('这里渲染了几次')}
        {/* 工具栏 */}
        <div className='tool'>
          <ButtonGroup>            
            {/* {Message_can_review}
            {Message_can_review1} */}
            {Message_can_edit}
            {/*{Message_can_edit1} */}
            <Button onClick={this.state.data_in ? this.removeData : this.addData} className={this.state.data_in ? 'export_button' : 'nono'}><Icon type={this.state.data_in ? 'check' : 'plus'} /></Button>
            <Button>
              <div className='dropdown'>
              <div className='dropbtn' style={this.props.is_20 === true ? {display: 'none'} : {}}><FormattedMessage id='export' defaultMessage='数据导出' /></div>
                <div className='dropdown-content'>
                {
                    this.state.file_JSON ? (
                      <a onClick={this.onCheckJSON} ><Spin size='small' />JSON</a>)
                      : (
                        <a onClick={this.onCheckJSON} >JSON</a>
                      )
                  }
                  {
                    this.state.file_XML ? (
                      <a onClick={this.onCheckXML} ><Spin size='small' />XML</a>)
                      : (
                        <a onClick={this.onCheckXML} >XML</a>
                      )
                  }
                  {
                    this.state.file_XLSX ? (
                      <a onClick={this.onCheckXLSX} ><Spin size='small' />XLSX</a>)
                      : (
                        <a onClick={this.onCheckXLSX} >XLSX</a>
                      )
                  }
                </div>
              </div>
            </Button>
          </ButtonGroup>
          
          <Modal
            title={t_DisReason}
            visible={this.state.disapprove_data}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Checkbox onChange={this.disapprove_reason1}>{t_DisReason1}</Checkbox><br></br>
            <Checkbox onChange={this.disapprove_reason2}>{t_DisReason2}</Checkbox><br></br>
            <Checkbox onChange={this.disapprove_reason3}>{t_DisReason3}</Checkbox><br></br>
            <Checkbox onChange={this.disapprove_reason4}>{t_DisReason4}</Checkbox><br></br>
            <Checkbox onChange={this.disapprove_reason5}>{t_DisReason5}</Checkbox><br></br>
            <Checkbox onChange={this.disapprove_reason6}>{t_DisReason6}</Checkbox><br></br>
            <Checkbox onChange={this.disapprove_reason7}>{t_DisReason7}</Checkbox><br></br>
          </Modal>
        </div>

        {/* 元数据 */}
        <div className='meta_body'>
          <div className='meta' >
            <div className='meta_left'>{t_CreatedAt}</div>
            <div className='meta_right'>{this.props.data.add_time || t_NA }</div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_Abstract}</div>
            <div className='meta_right'>{this.props.data.abstract || t_NA}</div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_Keywords}</div>
            <div className='meta_right'>
              {this.props.data.keywords.map((item) => {
                if (this.props.data.keywords.length === 0) {
                  return (
                    <div key=''>N/A</div>
                  );
                }
                if (item === '') {
                  return (
                    <div key=''></div>
                  );
                }
                return (
                  <div className='key_word' key='item'>
                    {item}
                  </div>);
              })}
            </div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_ReviewState}</div>
            <div className='meta_right'><ShowReviewState review_state={this.props.data.review_state} /></div>
          </div>
          <div className='meta' >
            <div className='meta_left'>DOI</div>
            <div className='meta_right'>{this.props.data.doi || t_NA}</div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_Author}</div>
            <div className='meta_right'>{this.props.data.author || t_NA}</div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_DataContributorInstitution}</div>
            <div className='meta_right'>{this.props.data.uploader_institution}</div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_ResponsibleInstitution}</div>
            <div className='meta_right'>{this.props.data.institution || t_NA}</div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_Contributor}</div>
            <div className='meta_right'>{this.props.data.contributor || t_NA}</div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_TemplateName}</div>
            <div className='meta_right'>{this.props.data.template.title}</div>
          </div>
           <div className='meta' >
            <div className='meta_left'>{t_subject_name}</div>
            <div className='meta_right'>{this.props.data.subject_name}</div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_subject_number}</div>
            <div className='meta_right'>{this.props.data.subject}</div>
          </div>

        </div>
           
        {/* 审核信息 */}
        <ShowReviewInf data={this.props.data}/>

        <div className='dividing_line'> </div>
        {/* Content */}
        <div >
          <h3>{t_Content}</h3>
          {this.props.data.template.content._ord.map((item: any) => {
            if (this.props.data.content[item] == null) {
              return null;
            }
            return (
              <div key={item}>
                <ItemRender name={item} 
                 template_content={this.props.data.template.content} 
                  data_content={this.props.data.content}
                   />
              </div>
            );
          })}
        </div>

        <div className='dividing_line'></div>
        {/* Other Info */}
        <div>
          <h3>{t_OtherInfo}</h3>
          <div className='meta' >
            <div className='meta_left'>{t_Source}</div>
            <div className='meta_right'><ShowSource source={this.props.data.source} /> </div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_Reference}</div>
            <div className='meta_right'> {this.props.data.reference || t_NA}  </div>
          </div>
          <div className='meta' >
            <div className='meta_left'>{t_Method}</div>
            <div className='meta_right'>
              {this.props.data.methods.map((item) => {
                return (
                  <div className='method_word' key='item'>
                    {item},
                  </div>);
              })}
            </div>
          </div>
        </div>

        <div className='dividing_line'></div>
        <div>
          <h3><FormattedMessage id='dataShow:citations' defaultMessage='引用与致谢'/></h3>
          <div className='meta' >
            <div><ShowReference data={this.props.data} /></div>
          </div>
        </div>
        <div className='dividing_line'> </div>

      </div>
    );
  }
}

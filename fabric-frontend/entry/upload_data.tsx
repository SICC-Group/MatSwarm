import React, { FC, useState } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';

import { Button, Steps } from 'antd';

import { UserRole } from '../apis/define/User';
import Urls from '../apis/Urls';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { FormPage } from '../components/layout/FormPage';
import { RoleCheckWrapper } from '../components/layout/RoleCheckWrapper';
import { MgeLayout } from '../components/layout/MgeLayout';
import { MenuKey } from '../components/layout/NavMenu';

import withStyles, { WithStyles } from 'react-jss';
import { Header } from '../components/data/Header';
import { CategoryTree } from '../components/common/CategoryTree';
import { TemplateTree } from '../components/common/TemplateTree';
import { FileUploader } from '../components/data/FileUploader';
import { FormUploader } from '../components/data/FormUploader';
import { DatasetUploader } from '../components/data/DatasetUploader';
import {MethodTree} from "../components/common/MethodTree";

const Step = Steps.Step;

const breadcrumbItems: BreadcrumbItem = 
  {
    title: <FormattedMessage id='data:upload_data' defaultMessage='上传数据' />,
  }

const chooseCategory = <FormattedMessage id='data:choose_category' defaultMessage='选择数据所属的分类' />;
const chooseTemplate = <FormattedMessage id='data:choose_template' defaultMessage='选择符合数据格式的模板' />;
const chooseMethod = <FormattedMessage id='data:choose_method' defaultMessage='选择提交方式' />;
const fillFormOrUploadFile = <FormattedMessage id='data:fill_or_upload' defaultMessage='填写表单或者文件模板' />;

const styles = {
  Steps: {
    margin: '36px 21px',
  },
  Content: {
    margin: '0 56px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  }
}

enum UploadMethod {
  File = "File", Form = "Form", Dataset = "Dataset"
}

const _UploadDataEntry: FC<WithStyles<typeof styles>> = ({ classes }) => {
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [method, setMethod] = useState<number | undefined>(undefined);
  const [templateID, setTemplateID] = useState<number | null>(null);
  const [uploadMethod, setUploadMethod] = useState(UploadMethod.File);
  
  const calculateStep = () => {
    // if (category == null) {
    //   return 0;
    // }
    if (templateID == null) {
      return 1;
    }
    return 3;
  };

  const handleCategoryChange = (newID: number) => {
    setCategory(newID);
    setMethod(null);
    setTemplateID(null);
  };

  const handleMethodChange = (newID: number) => {
    setMethod(newID);
    setTemplateID(null);
  };

  let uploader = (
    <div style={{padding: '12px 0'}}>
      <FormattedMessage id='data:select_template' defaultMessage='请先选择模板'/>
    </div>
  );

  if (uploadMethod === UploadMethod.File && templateID != null) {
    uploader = <FileUploader templateID={templateID} categoryID={category!}/>;
  }
  if (uploadMethod === UploadMethod.Form && templateID != null) {
    uploader = <FormUploader templateID={templateID} categoryID={category!}/>
  }
  if (uploadMethod === UploadMethod.Dataset && templateID != null) {
    uploader = <DatasetUploader templateID={templateID} categoryID={category!}/>
  }

  return (
    <MgeLayout
      loginRequired
      selectedMenu={MenuKey.Upload}>
      <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems]} />
      <FormPage title={<FormattedMessage id='data:upload_data' defaultMessage='上传数据' />}>
        <div className={classes.Content}>
          <RoleCheckWrapper
            forbidMessage={<FormattedMessage id='data:forbid' defaultMessage='您没有上传数据的权限' />}
            requiredRoles={[]}>
            <div className={classes.Steps}>
              <Steps current={calculateStep()}>
                <Step title={<FormattedMessage id='data:choose_category' defaultMessage='选择分类'/>} description={chooseCategory} />
                <Step title={<FormattedMessage id='data:choose_template' defaultMessage='选择模板'/>} description={chooseTemplate} />
                <Step title={<FormattedMessage id='data:commit_method' defaultMessage='提交方式'/>} description={chooseMethod} />
                <Step title={<FormattedMessage id='data:fill_data' defaultMessage='填写数据'/>} description={fillFormOrUploadFile} />
              </Steps>
            </div>
            {/* <Header title={<FormattedMessage id='data:choose_category' defaultMessage='选择分类'/>}/>
            <div>
              <CategoryTree style={{width: '48%', padding: '12px 0'}} value={category} onChange={handleCategoryChange}/>
              <MethodTree style={{width: '48%', padding: '12px 0', marginLeft: '4%'}} value={method} category={category} onChange={handleMethodChange} />
            </div> */}
            <Header title={<FormattedMessage id='data:choose_template' defaultMessage='选择模板'/>}/>
            <div style={{padding: '12px 0'}}>
            {
              // category == null ? (
              //   <FormattedMessage id='data:select_category' defaultMessage='请先选择模板的分类'/>
              // ) : (
                <TemplateTree style={{width: '48%'}}  methodID={method} categoryID={category} value={templateID!} onChange={setTemplateID}/>
              // )
            }
            </div>
            <Header title={<FormattedMessage id='data:commit_method' defaultMessage='提交方式'/>}/>
            <div style={{padding: '12px 0', textAlign: 'center'}}>
              <Button.Group size='large'>
                <Button type={uploadMethod === UploadMethod.Form ? 'primary' : 'default'} onClick={() => setUploadMethod(UploadMethod.Form)}>
                  <FormattedMessage id='data:upload_by_form' defaultMessage='通过网页提交'/>
                </Button>
                <Button type={uploadMethod === UploadMethod.File ? 'primary' : 'default'} onClick={() => setUploadMethod(UploadMethod.File)}>
                  <FormattedMessage id='data:upload_by_file' defaultMessage='通过文件提交'/> 
                </Button>
                <Button type={uploadMethod === UploadMethod.Dataset ? 'primary' : 'default'} onClick={() => setUploadMethod(UploadMethod.Dataset)}>
                  <FormattedMessage id='SubmitDataset' defaultMessage='提交数据集'/> 
                </Button>
              </Button.Group>
            </div>
            <Header title={<FormattedMessage id='data:fill_data' defaultMessage='填写数据'/>}/>
            {uploader}
          </RoleCheckWrapper>
        </div>

      </FormPage>
    </MgeLayout>
  );
}

const UploadDataEntry = withStyles(styles)(_UploadDataEntry);

ReactDOM.render(<UploadDataEntry />, document.getElementById('wrap'));

import React, { FC, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, notification } from 'antd';
import withStyles, { WithStyles } from 'react-jss';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { AnyField, ContainerField } from '../../apis/define/Field';
import { Outline } from '../template/Outline';
import { TemplateDataType } from '../template/DataType';
import { TemplateInfoEdit } from '../template/TemplateInfoEdit';

import { EditorContext } from '../template/context/EditorContext';
import { FieldTypeToComponent } from '../template/fields/all';
import { InlineDropArea } from '../template/drop/InlineDropArea';
import { TemplateCtrl } from '../template/context/TemplateCtrl';
import { Translate as _T } from '../../locale/translate';
import { MgeError } from '../../apis/Fetch';
import { UpdateTemplate } from '../../apis/template/Update';
import { GetTemplateNew } from '../../apis/template/Get';
import {FieldTypeToComponentEdit} from '../template/fields/edit'
import { get_snippet_one,edit_snippet} from '../../apis/template/ListSnippets';
const styles = {
  CreateTemplate: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    flex: 'auto',
  },
  OutlineWrapper: {
    width: '288px',
    flex: 'auto',
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  OutlineHeader: {
    background: '#EDEDED',
    color: '#0A2D47',
    fontSize: '20px',
    lineHeight: '28px',
    padding: '10px 20px',
    flex: 0,
  },
  OutlineContent: {
    background: '#FFF',
    flex: 'auto',
    flexGrow: 1,
    overflowY: 'scroll',
  },
  MainContent: {
    flex: 'auto',
    display: 'flex',
    padding: '20px 28px',
    flexDirection: 'column',
  },
  ScrollWrapper: {
    flexGrow: 0,
    overflowY: 'scroll',
    flexDirection: 'column',
  },
  SubmitWrapper: {
    textAlign: 'right',
    padding: '8px 0',
  }
}

const rootRender = (template: AnyField[], informUpdate: () => void,modify:boolean) => {
  return (
    <div>
      {
        template.map((value, index, array) => {
          const View = FieldTypeToComponent(value.type);
          const ViewEdit = FieldTypeToComponentEdit(value.type);
          return (
            <div>
            {modify?<View key={index} parent={[]} index={index}
            path={[index]} field={template[index]}
            informUpdate={informUpdate}
            isFirst={index === 0} isLast={index === array.length - 1} />
            :
            <ViewEdit key={index} parent={[]} index={index}
            path={[index]} field={template[index]}
            informUpdate={informUpdate}
            isFirst={index === 0} isLast={index === array.length - 1} 
            />}
            </div>
          );
        })
      }
      <InlineDropArea parent={[]} index={template.length} large />
    </div>
  )
}

function pathToString(path: number[], template: AnyField[]): string {
  console.log(path);
  if (path.length === 0) {
    return _T('template:in_root');
  }
  let result: string[] = [];
  let current = template;
  for (let i = 0; i < path.length; ++i) {
    if (current[path[i]].title != null) {
      result.push(current[path[i]].title);
      console.log('append ' + current[path[i]].title);
    }
    else {
      result.push(`${i}`);
      console.log('append ' + i);
    }
    current = (current[path[i]] as ContainerField).children;
  }
  return result.join(' -> ');
}
const url = window.location.href.split('/');
const _EditTemplate: FC<WithStyles<typeof styles>> = ({ classes }) => {

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [categoryID, setCategoryID] = useState<number>(undefined);
  const [method, setMethod] = useState<number | undefined>(undefined);
  const [selectedField, setSelectedField] = useState('');
  const [modify,setModify] = useState<boolean>(true)
  const [templateID, setTemplateID] = useState<number>(null);
  const [template, setTemplate] = useState<AnyField[]>([]);
  const [istem,setIstem] = useState<boolean>(true);
  const leavlConfirm = (e: BeforeUnloadEvent) => {
    let confirmationMessage = _T("leave_confirm");

    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  }

  useEffect(() => {
    var id: number = Number(window.location.href.split('/').pop());
    let type:string = String(url[url.length-2])
    console.log(url,type)
    {type === 'edit_template'?
    GetTemplateNew(id).then((value) => {
      setTitle(value.title);
      setCategoryID(value.category);
      setDesc(value.abstract);
      setMethod(value.method_id);
      setTemplateID(value.id);
      setTemplate(value.content);
      if(value.data_count == 0){setModify(true)} //模板下数据为0时可以随意修改
      else{setModify(false)}
    }):
    (
    setIstem(false),
    get_snippet_one(id).then((value)=>{
      setTitle(value.snippet_name);
      setTemplateID(value.id)
      setTemplate(value.content);
    }))
   }
    window.addEventListener("beforeunload", leavlConfirm);
    return () => {
      window.removeEventListener("beforeunload", leavlConfirm);
    }
  }, [])

  const informUpdate = () => {
    setTemplate([...template]);
  }

  const openNotification = (error: any) => {

    let text: React.ReactNode = '';

    if ('id' in error) {
      text = _T(error.id);
      if ('path' in error) {
        text = (
          <div>
            {_T(error.id)}<br />
            {_T('location')}: &nbsp;{pathToString(error.path, template)}
          </div>
        )
      }
    }
    else if (error instanceof MgeError) {
      console.log(error.message);
      console.log(error.detail);
      text = `${error.message}: ${error.detail}`;
    }

    notification['error']({
      message: _T('error'),
      description: text,
    });
  };

  const showSuccess = () => {
    Modal.success({
      title: istem?(_T('template_edit_success')):(_T('snippet_edit_success')),
    })
  }

  const handleUpdateButtonClick = (publish: boolean) => {
    istem?
    UpdateTemplate(templateID, {
      title, categoryID, abstract: desc, publish, method,
    }, template).then(() => {
      showSuccess();
    }).catch((reason: any) => {
      openNotification(reason);
    }):
    edit_snippet(templateID,title,template).then(() =>{
      showSuccess();
    }).catch((reason:any)=>{
      openNotification(reason);
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classes.CreateTemplate}>


        <div className={classes.OutlineWrapper}>
          <div className={classes.OutlineHeader}>
            <FormattedMessage id='template:outline' defaultMessage='模板大纲' />
          </div>
          <div className={classes.OutlineContent}>
            <Outline template={template}
              selected={selectedField}
              onClick={setSelectedField} draggable={false}/>
          </div>
        </div>

        <EditorContext.Provider value={{
          templateCtrl: new TemplateCtrl(template, informUpdate)
        }}>

          <div className={classes.MainContent}>
            {/* 数据类型 */}
            <TemplateDataType />

            <div className={classes.ScrollWrapper}>
              {/* 中间部分 */}
              <TemplateInfoEdit
                is_tem={istem}
                title={title} onTitleChange={setTitle}
                desc={desc} onDescChange={setDesc}
                method={method} onMethodChange={setMethod}
                categoryID={categoryID} onCategoryIDChange={(id) => { setCategoryID(id); }}
              />

              {/* 核心的数据提交部分 */}
              {rootRender(template, informUpdate,modify)}

              {/* 最后的保存提交按钮 */}
              <div className={classes.SubmitWrapper}>
                <Button.Group>
                  <Button type='default' size='large' onClick={() => handleUpdateButtonClick(false)}>
                    <FormattedMessage id='update' defaultMessage='更新' />
                  </Button>
                  <Button type='primary' size='large' onClick={() => handleUpdateButtonClick(true)}>
                    <FormattedMessage id='update_and_publish' defaultMessage='更新并发布' />
                  </Button>
                </Button.Group>
              </div>
            </div>
          </div>
        </EditorContext.Provider>
      </div>
    </DndProvider>
  );
};

export const EditTemplate = withStyles(styles)(_EditTemplate);

import React, { FC, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, notification } from 'antd';
import withStyles, { Styles, WithStyles } from 'react-jss';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { AnyField, ContainerField } from '../../apis/define/Field';
import { Outline } from '../template/Outline';
import { TemplateDataType } from '../template/DataType';
import { TemplateInfo } from '../template/TemplateInfo';

import { EditorContext } from '../template/context/EditorContext';
import { CommitTemplate } from '../../apis/template/Commit';
import { FieldTypeToComponent } from '../template/fields/all';
import { InlineDropArea } from '../template/drop/InlineDropArea';
import { TemplateCtrl } from '../template/context/TemplateCtrl';
import { Translate as _T } from '../../locale/translate';
import { MgeError } from '../../apis/Fetch';
import { UpdateTemplate } from '../../apis/template/Update';

import { ChooseTemplateModal } from './ChooseTemplateModal';

import { FieldType } from '../../apis/define/FieldType';
import Cookie from 'js-cookie'
import { ChooseSnippetModal } from './ChooseSnippetModal';
import { create_snippet,edit_snippet } from '../../apis/template/ListSnippets';
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

const rootRender = (template:any[],templateIdentifier: string, informUpdate: () => void,is_tem:boolean,onload:(location:number[])=>void) => {
  var haveRenderIdentifier = false;
  return (
    <div>
      {
        // 标识符字段必须存在，不可更改，显示的view略有不同
        template.map((value, index, array) => {
          const View = FieldTypeToComponent(value.type);
          if(value.title === templateIdentifier && !haveRenderIdentifier && is_tem){
            haveRenderIdentifier = true;
            return (
                <View key={index} parent={[]} index={index}
                  path={[index]} field={template[index]}
                  informUpdate={informUpdate} isIdentifier={true}
                  isFirst={index === 0} isLast={index === array.length - 1}/>
            );
          }else{
            return (
                <View key={index} parent={[]} index={index}
                  path={[index]} field={template[index]}
                  informUpdate={informUpdate}
                  isFirst={index === 0} isLast={index === array.length - 1} onLoad={onload}/>
            );
          }
        })
      }
      <InlineDropArea parent={[]} index={template.length} large onLoad={()=>onload([template.length])} container={true}/>
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
export interface CreateTemplateProps extends WithStyles<typeof styles>{
  is_tem:boolean
}
const _CreateTemplate: FC<CreateTemplateProps> = ({ classes,is_tem }) => {

  // 每一个模板都要有标识符字段，默认直接添加一个不可删除的字符串类型字段作为标识符字段
  const defaultTemplateIdentifier = {
    required: true,
    title: "",
    type: 1,
  };

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [categoryID, setCategoryID] = useState<number>(undefined);
  const [categoryName, setCategoryName] = useState<string>("");
  const [selectedField, setSelectedField] = useState('');

  const [templateID, setTemplateID] = useState<number>(null);

  const [template1, setTemplate1] = useState<any[]>([]);
  const [method, setMethod] = useState<number | undefined>(undefined);
  const [templateIdentifier, settemplateIdentifier] = useState<AnyField>(defaultTemplateIdentifier);
  const [template, setTemplate] = useState<AnyField[]>([templateIdentifier]);
  const [location,setLocation] = useState<number[]>([]);
  const leavlConfirm = (e: BeforeUnloadEvent) => {
    let confirmationMessage = _T("leave_confirm");

    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  }

  useEffect(() => {
    window.addEventListener("beforeunload", leavlConfirm);
    Cookie.set('categoryID','')
    return () => {
      window.removeEventListener("beforeunload", leavlConfirm);
    }
  }, [])

  useEffect(()=>{
    is_tem?setTemplate([templateIdentifier]):setTemplate([]);
  },[is_tem])

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
      title:is_tem? _T('template_commit_success'):_T('snippet_commit_success'),
    })
  }



  const handleSubmitButtonClick = (publish: boolean) => {
    const identifier = templateIdentifier.title;
    let hasIDstr = false;
    for (const item of template) {
      if (item.title === 'id')
        hasIDstr = true;
    }
    if(hasIDstr)
    {
      notification.error({
        message:<FormattedMessage id='template:inst_3'
                                defaultMessage='请勿在第一层容器建立名为id的字段！！' />,
      });
    }
    else
    {
        is_tem?
        CommitTemplate({
        title, categoryID, categoryName, abstract: desc, publish, method, identifier,
      }, template).then((result) => {
        setTemplateID(result.templateID);
        console.log(result);
        showSuccess();
      }).catch((reason) => {
        openNotification(reason);
      })
      :
        create_snippet(title,template).then((result)=>{
          setTemplateID(Number(result))
          showSuccess();
        }).catch((reason)=>{
          openNotification(reason)
        })
    }

  }
  const handleUpdateButtonClick = (publish: boolean) => {
    is_tem?
    UpdateTemplate(templateID, {
      title, categoryID, abstract: desc, publish, method
    }, template).then(() => {
      showSuccess();
    }).catch((reason: any) => {
      openNotification(reason);
    }):
    edit_snippet(templateID,title,template).then(() => {
      showSuccess();
    }).catch((reason:any) =>{
      openNotification(reason);
    })
  }

  const [chooseTemplateShow, setChooseTemplateShow] = useState(false);
  const [chooseSnippetsShow, setChooseSnippetsShow] = useState(false);
  const handleLoadClick = () => {
    setChooseTemplateShow(true);
  }

  const handleLoadTemplate = (content: AnyField[]) => {
    setTemplate(template.concat(content));
    setChooseTemplateShow(false);
  }
  const hanldeLoadSnippetsClick = (location:number[]) =>{//导入模板片段弹窗
    setLocation(location);
    setChooseSnippetsShow(true);
  }
  //在相应位置拼接模板片段
  function jointsnippet(template:AnyField[],content:AnyField[],location:number[]){
    if(location.length === 1){
      (template[location[0]] as ContainerField).children = (template[location[0]] as ContainerField).children.concat(content)
      return template
    }
    else{
      let i = location.shift();
      (template[i] as ContainerField).children = jointsnippet((template[i] as ContainerField).children,content,location)
      return template; //返回拼接后的模板
    }
  }
  
  const handleLoadSnippet = (content: AnyField[]) =>{
    if(location[0] === template.length){ //最底部拼接模板片段
      setTemplate(template.concat(content))
    }else{
      setTemplate(jointsnippet(template,content,location))
    }
    setChooseSnippetsShow(false);
  }
  //模板内容转换
  const changeForm = (obj: any, title: any) => {
    var cont = {};
    var child = {};
    var children = [];
    switch (obj.t) {
      case FieldType.String: {
        cont = { title: title.toString(), required: obj.r, type: obj.t }
        break;
      }
      case FieldType.Number: {
        cont = { title: title.toString(), required: obj.r, type: obj.t, unit: obj.misc.unit };
        break;
      }
      case FieldType.Range: {
        cont = { title: title.toString(), required: obj.r, type: obj.t, unit: obj.misc.unit, subType: obj.misc.type };
        break;
      }
      case FieldType.Image: {
        cont = { title: title.toString(), required: obj.r, type: obj.t, allowMulti: obj.misc.multi };
        break;
      }
      case FieldType.File: {
        cont = { title: title.toString(), required: obj.r, type: obj.t, allowMulti: obj.misc.multi };
        break;
      }
      case FieldType.Choice: {
        cont = { title: title.toString(), required: obj.r, type: obj.t, choices: obj.misc.opt.concat(obj.misc.grp) };
        break;
      }
      case FieldType.Array: {
        child = changeForm(obj.misc, obj.misc.title || "")
        cont = { title: title.toString(), required: obj.r, type: obj.t, children: [child] };
        break;
      }
      case FieldType.Table: {
        for (var item in obj.misc) {
          if (item !== "_head") {
            child = changeForm(obj.misc[item], item)
            children.push(child);
          }
        }
        cont = { title: title.toString(), required: obj.r, type: obj.t, children: children };
        break;
      }
      case FieldType.Container: {
        for (var item in obj.misc) {
          if (item !== "_ord") {
            child = changeForm(obj.misc[item], item)
            children.push(child);
          }
        }
        cont = { title: title.toString(), required: obj.r, type: obj.t, children: children };
        break;
      }
      case FieldType.Generator: {
        for (var item in obj.misc) {
          if (item !== "_opt") {
            child = changeForm(obj.misc[item], item)
            children.push(child);
          }
        }
        cont = { title: title.toString(), required: obj.r, type: obj.t, children: children };
        break;
      }
    }
    return cont;
  }

  //json文件读取
  const toTemplate = (file: any) => {
    var meta = file.meta; //模板元数据
    var time = new Date();
    setTitle(meta.title + '(' + time.toLocaleDateString() + '-' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ')' );
    setCategoryID(meta.category_id);
    Cookie.set('categoryID',meta.category_id);
    setDesc(meta.abstract);
    // setTemplateID(meta.id);
    var content = file.content; //模板内容
    var template11 = template1;
    var cont = {};
    for (var item in content) {
      if (item !== "_ord") {
        cont = changeForm(content[item], item)
        template11.push(cont);
      }
    }
    setTemplate(template.concat(template11));
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
              onClick={setSelectedField} updateTemplate={setTemplate} draggable={true}/>
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
              <TemplateInfo
                onLoadClick={handleLoadClick}
                title={title} onTitleChange={setTitle}
                desc={desc} onDescChange={setDesc}
                method={method} onMethodChange={(id) => setMethod(id)}
                categoryID={categoryID} onCategoryIDChange={(id) => { setCategoryID(id); setMethod(null);Cookie.set('categoryID',String(id));}}
                onImport={(tem) => toTemplate(tem)}
                is_tem={is_tem}
                setName={(label: string) => setCategoryName(label)}
              />

              {/* 核心的数据提交部分 */}
              {rootRender(template, templateIdentifier.title, informUpdate,is_tem,hanldeLoadSnippetsClick)}

              {/* 最后的保存提交按钮 */}
              <div className={classes.SubmitWrapper}>
                {
                  templateID == null ? (
                    <Button.Group>
                      <Button type='default' size='large' onClick={() => handleSubmitButtonClick(false)}>
                        <FormattedMessage id='save' defaultMessage='保存' />
                      </Button>
                      <Button type='primary' size='large' onClick={() => handleSubmitButtonClick(true)}>
                        <FormattedMessage id='submit' defaultMessage='提交' />
                      </Button>
                    </Button.Group>
                  ) : null
                }
                {
                  templateID != null ? (
                    <Button.Group>
                      <Button type='default' size='large' onClick={() => handleUpdateButtonClick(false)}>
                        <FormattedMessage id='update' defaultMessage='更新' />
                      </Button>
                      <Button type='primary' size='large' onClick={() => handleUpdateButtonClick(true)}>
                        <FormattedMessage id='update_and_publish' defaultMessage='更新并发布' />
                      </Button>
                    </Button.Group>
                  ) : null
                }
              </div>
            </div>
          </div>


        </EditorContext.Provider>
      </div>

      {/* 模板导入的界面 */}
      <ChooseTemplateModal
        informLoad={handleLoadTemplate}
        onCancel={() => setChooseTemplateShow(false)}
        visible={chooseTemplateShow}> 

      </ChooseTemplateModal>
      
      <ChooseSnippetModal
      informLoad={handleLoadSnippet}
      onCancel={()=>{setChooseSnippetsShow(false)}}
      visible={chooseSnippetsShow}>
      </ChooseSnippetModal>
    </DndProvider>
  );
};

export const CreateTemplate = withStyles(styles)(_CreateTemplate);

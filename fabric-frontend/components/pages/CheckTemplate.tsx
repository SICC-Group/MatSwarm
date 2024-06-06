import React, { FC, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import withStyles, { WithStyles } from 'react-jss';

import { AnyField } from '../../apis/define/Field';
import { Outline } from '../template/Outline';
import { TemplateInfoCheck } from '../template/TemplateInfoCheck';

import { EditorContext } from '../template/context/EditorContext';
import { FieldCheck } from '../template/fields/check';
import { TemplateCtrl } from '../template/context/TemplateCtrl';
import { Translate as _T } from '../../locale/translate';
import { GetTemplateNew } from '../../apis/template/Get';
import { get_snippet_one } from '../../apis/template/ListSnippets';
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

const rootRender = (template: AnyField[]) => {
    return (
        <div>
            {
                template.map((value, index, array) => {
                    const View = FieldCheck(value.type);
                    return (
                        <View key={index} parent={[]} index={index}
                            path={[index]} field={template[index]}
                            informUpdate={null}
                            isFirst={index === 0} isLast={index === array.length - 1} />
                    );
                })
            }
        </div>
    )
}

const url = window.location.href.split('/');
const _CheckTemplate: FC<WithStyles<typeof styles>> = ({ classes }) => {

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [categoryID, setCategoryID] = useState<number>(undefined);
    const [method, setMethod] = useState<number | undefined>(undefined);
    const [selectedField, setSelectedField] = useState('');

    const [templateID, setTemplateID] = useState<number>(null);
    const [template, setTemplate] = useState<AnyField[]>([]);

    useEffect(() => {
        var id: number = Number(window.location.href.split('/').pop());
        var type:string = String(url[url.length-2]); 
        type === 'check_template'?
        GetTemplateNew(id).then((value) => {
            setTitle(value.title);
            setCategoryID(value.category);
            setDesc(value.abstract);
            setMethod(value.method_id);
            setTemplateID(value.id);
            setTemplate(value.content);
        })
        :
        get_snippet_one(id).then((value) => {
            console.log(value.content)
            setTitle(value.snippet_name);
            setCategoryID(null);
            setDesc('');
            setMethod(null);
            setTemplateID(value.id);
            setTemplate(value.content);
        })
    }, [])

    return (
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
                templateCtrl: new TemplateCtrl(template, null)
            }}>
                <div className={classes.MainContent}>

                    <div className={classes.ScrollWrapper}>
                        {/* 中间部分 */}
                        <TemplateInfoCheck
                            title={title} onTitleChange={setTitle}
                            desc={desc} onDescChange={setDesc}
                            method={method} onMethodChange={setMethod}
                            categoryID={categoryID} onCategoryIDChange={(id) => { setCategoryID(id); }}
                        />

                        {/* 核心的数据提交部分 */}
                        {rootRender(template)}

                    </div>
                </div>
            </EditorContext.Provider>
        </div >
    );
};

export const CheckTemplate = withStyles(styles)(_CheckTemplate);

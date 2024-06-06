import React , {useState} from 'react' ;
import BraftEditor from 'braft-editor' ;
import'../../node_modules/braft-editor/dist/index.css';
import {UploadFn} from "../../apis/feedback/Upload"


export const RichtextEdit = (props: any)=> {

 // 设置编辑器初始内容
const [editorState,setEditorState] =useState(BraftEditor.createEditorState('<p></p>'));

 // 编辑内容触发
const handleChange = (editorState: any) => {
    setEditorState(editorState)
    const content =editorState.toHTML();
    props.getContent(content)
}


return (
    <>
    <div >
        <BraftEditor
            contentStyle={{ height: 305 }}
            value={editorState}
            onChange={handleChange}
            media={{uploadFn: UploadFn}}
            />
    </div>     
        </>
    )
}

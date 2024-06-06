import React from 'react';
import { TemplateCtrl } from './TemplateCtrl';

export interface IEditorContext {
  templateCtrl: TemplateCtrl;
}

export const EditorContext = React.createContext<IEditorContext>({
  templateCtrl: new TemplateCtrl([]),
});

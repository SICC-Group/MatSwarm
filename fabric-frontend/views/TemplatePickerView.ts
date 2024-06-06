import { GetCategory } from '../apis/category/Get';
import { Category } from '../apis/define/Category';
import { Template } from '../apis/define/Template';
import { GetTemplateByCatetoryID } from '../apis/template/GetTemplateByCategoryID';
import { GenerateUniqueID } from '../utils/GenerateUniqueID';
import { Enum } from '../utils/Enum';
import { LoaderContentView } from './LoaderView';
import { MgeModalWindow } from './ModalWindowView';
import { SelectorView } from './SelectorView';
import { INode, TreeView, TreeViewEvent, UserNode } from './TreeView';
import { IView } from './View';

const $ = require('jquery');

interface CategoryInfo {
  id: number;
  isLeaf: boolean;
  name: string;
}

function CategoryToTreeView(categories: Category[], prefix?: string): Array<UserNode<CategoryInfo>> {
  
  const ret: Array<UserNode<CategoryInfo>> = [];
  for (const i of categories) {
    const isLeaf = (i.children.length === 0);
    const name = (prefix == null ? i.name : prefix + i.name);
    const node = new UserNode<CategoryInfo>({id: i.id, isLeaf, name}, i.name, isLeaf);
    if (!isLeaf) {
      node.children = CategoryToTreeView(i.children, name + '>');
    }
    ret.push(node);
  }
  return ret;
}

// 工具函数，把模板信息列表转换成Selector的格式
function TemplateInfoToEnum(infoList: Template.Info[]): Enum<number> {
  const names: string[] = [];
  const values: number[] = [];
  for (const i of infoList) {
    names.push(i.title);
    values.push(i.id);
  }
  if (names.length === 0) { return null; }
  names.unshift(django.gettext('Select a template'));
  values.unshift(-1);
  return new Enum<number>(names, values);
}

export class TemplatePickerView implements IView {
  
  private view: JQuery<HTMLElement>;
  private templateDivID: string;
  private categoryDivID: string;

  private selectedCategoryID: number;
  private selectedTemplateID: number;

  private onTemplateChangeListeners: Array<(tid: number) => void>;

  constructor() {
    this.categoryDivID = GenerateUniqueID();
    this.templateDivID = GenerateUniqueID();

    this.selectedCategoryID = -1;
    this.selectedTemplateID = -1;
    
    this.onTemplateChangeListeners = [];

    // this.isCategoryLoaded = false;

    this.view = $(
      `<div id="${this.categoryDivID}" class="col-md-6" style="margin-bottom: 8px;">
      </div>
      <div id="${this.templateDivID}" class="col-md-6"  style="margin-bottom: 8px;">
      </div>`);

    const categoryLoading = new LoaderContentView();

    this.view.filter(`#${this.categoryDivID}`).append(categoryLoading.GetView());

    GetCategory().then((categories: Category[]) => {
      // view中的按钮
      const button = $(`<button class="btn btn-default" style="display: block; width: 100%;">${django.gettext('Select a category')}...</button>`);
      const categoryModal = new MgeModalWindow({
        title: django.gettext('Choose category'),
        clickOverlayToClose: true,
      });
      categoryModal.HideFooter();
      const userNodes = CategoryToTreeView(categories);
      const treeView = new TreeView<CategoryInfo>(
        userNodes,
        {slideUpOthers: false, showDelete: false, scrollToView: false, showIcon: true, expandAll: true});
      treeView.AddEventListener((node: INode<CategoryInfo>, e) =>  {
        if (e === TreeViewEvent.Click) {
          if (node.info.isLeaf) {
            categoryModal.Hide();
            if (node.info.id !== this.selectedCategoryID) {
              const templateLoading = new LoaderContentView();
              this.selectedCategoryID = node.info.id;
              button.text(`${django.gettext('Category')}: ${node.info.name}`);
              this.view.filter(`#${this.templateDivID}`).empty().append(templateLoading.GetView());
              GetTemplateByCatetoryID(this.selectedCategoryID).then((content) => {
                const en = TemplateInfoToEnum(content.templates);
                if (en == null) {
                  templateLoading.content = $(`<button class="btn btn-default" style="width: 100%;
                  background: #fff;opacity: 1;" disabled>${django.gettext('No available templates.')}</div>`);
                }
                else {
                  const templatePicker = new SelectorView(en, -1);
                  templatePicker.AddOnChooseListener((old, newID) => {
                    this.selectedTemplateID = newID;
                    for (const i of this.onTemplateChangeListeners) {
                      i(this.selectedTemplateID);
                    }
                    return true;
                  });
                  templateLoading.content = templatePicker.GetView();
                }
              });
              // TODO chagne tempalte id to -1
              if (this.selectedTemplateID !== -1) {
                this.selectedTemplateID = -1;
                for (const i of this.onTemplateChangeListeners) {
                  i(this.selectedTemplateID);
                }
              }
            }
          }
        }
        return false;
      });
      categoryModal.setContent(treeView.GetView());
      button.click(() => {
        categoryModal.Show();
      });
      categoryLoading.content = button;
    });
  }

  public GetSelectedCategoryID(): number {
    return this.selectedTemplateID;
  }

  public GetSelectedTemplateID(): number {
    return this.selectedTemplateID;
  }

  public addOnTemplateChangeListener(listener: (tid: number) => void): void {
    this.onTemplateChangeListeners.push(listener);
  }

  public GetView(): JQuery<HTMLElement> {
    return this.view;
  }
}

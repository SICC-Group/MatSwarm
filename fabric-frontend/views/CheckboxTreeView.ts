import { GenerateUniqueID } from '../utils/GenerateUniqueID';
import { TreeNode } from '../utils/Tree';
import { IView } from './View';

const $ = require('jquery');

import '../style/MaterialCheckbox.scss';
import './TreeView.scss';

export class CheckboxUserNode<T> implements TreeNode<T> {
  public info: T;
  public content: string;
  public children: Array<CheckboxUserNode<T>>;
  public isLeaf: boolean;
  // public expanded: boolean;

  constructor(info: T, content: string, isLeaf: boolean) {
    this.info = info;
    this.content = content;
    this.children = [];
    this.isLeaf = isLeaf;
    // this.expanded = expanded;
  }
}

export interface ICheckboxNode<T> {
  info: T;
  content: string;
  view: JQuery<HTMLElement>;
  isLeaf: boolean;
  checked: boolean;

  Delete(): void;
  Children(): Array<ICheckboxNode<T>>;
}

export interface ICheckboxViewProvider<T> {
  // 构造根元素的时候调用（暂时没用到）
  // onContructRootWrapper(): JQuery<HTMLElement>;
  // 需要构造一个新的item时调用
  onContructItem(node: ICheckboxNode<T>, isRoot: boolean): JQuery<HTMLElement>;
  // 子节点添加到父节点时调用
  onAppendNode(parent: ICheckboxNode<T>, child: ICheckboxNode<T>): void;
  // 从父节点删除子节点时使用
  onDeleteNode(parent: ICheckboxNode<T>, child: ICheckboxNode<T>): void;

  onCheckNode(node: ICheckboxNode<T>): void;

  onUncheckNode(node: ICheckboxNode<T>): void;

  onRemoveRoot(node: ICheckboxNode<T>): void;
}

export class CheckboxNode<T> implements ICheckboxNode<T> {
  public info: T;
  public parent: CheckboxNode<T>;
  public children: Array<CheckboxNode<T>>;
  public provider: ICheckboxViewProvider<T>;
  public content: string;
  public view: JQuery<HTMLElement>;
  public readonly isLeaf: boolean;
  private _checked: boolean;
  public get checked(): boolean {
    return this._checked;
  }

  public set checked(value: boolean) {
    this._checked = value;
    if (value) {
      this.provider.onCheckNode(this);
    }
    else {
      this.provider.onUncheckNode(this);
    }
    if (!this.isLeaf) {
      for (const i of this.children) {
        i.checked = value;
      }
    }
    if (this.parent != null) {
      this.parent.UpdateCheckState();
    }
  }

  constructor(
    provider: ICheckboxViewProvider<T>, 
    userNode: CheckboxUserNode<T>,
    parent: CheckboxNode<T>) {
    this.info = userNode.info;
    this.parent = parent;
    this.children = [];
    this.isLeaf = userNode.isLeaf;
    this.provider = provider;
    this.content = userNode.content;
    this._checked = false;

    this.view = this.provider.onContructItem(this, (parent == null));

    if (!this.isLeaf) {
      for (const i of userNode.children) {
        this.Append(i);
      }
    }
  }

  public Append(node: CheckboxUserNode<T>): void {
    if (this.isLeaf) { 
      return;
    }
    const newNode = new CheckboxNode<T>(this.provider, node, this);
    this.children.push(newNode);
    this.provider.onAppendNode(this, newNode);
    
    this.UpdateCheckState();
  }

  public Delete(): void {
    this.provider.onDeleteNode(this.parent, this);
    if (this.parent != null) {
      const brothers = this.parent.children;
      const index = brothers.indexOf(this);
      if (index !== -1){
        brothers.splice(brothers.indexOf(this), 1);
      }
      this.parent.UpdateCheckState();
    }
    else {
      // inform owner to remove itself
      this.provider.onRemoveRoot(this);
    }
  }

  public Children(): Array<CheckboxNode<T>> {
    if (this.isLeaf) { 
      return;
    }
    return this.children;
  }

  private UpdateCheckState(): void {
    if (this.isLeaf){
      return;
    }
    let state = true;
    if (this.children.length === 0) { state = this._checked; }
    for (const i of this.children) {
      state = state && i.checked;
    }
    this._checked = state;
    if (state) {
      this.provider.onCheckNode(this);
    }
    else {
      this.provider.onUncheckNode(this);
    }
    if (this.parent != null) {
      this.parent.UpdateCheckState();
    }
  }
}

export class CheckboxTreeViewConfig {
  public showDelete: boolean;
}

// TODO 支持check事件
export enum CheckboxTreeViewEvent {
  Delete,
}

export class CheckboxTreeView<T> implements IView, ICheckboxViewProvider<T> {
  private nodes: Array<CheckboxNode<T>>;
  private rootView: JQuery<HTMLElement>;
  private config: CheckboxTreeViewConfig;
  private onEventListeners: Array<(node: ICheckboxNode<T>, e: CheckboxTreeViewEvent) => boolean>;

  constructor(nodes: Array<CheckboxUserNode<T>>, config: CheckboxTreeViewConfig) {
    this.config = config;
    this.rootView = $('<ul class="tree-view-with-checkbox animated"></ul>');
    this.nodes = [];
    this.onEventListeners = [];
    for (const i of nodes) {
      const node = new CheckboxNode<T>(this, i, null);
      this.nodes.push(node);
    }
  }

  public AppendRootNode(userNode: CheckboxUserNode<T>) {
    const node = new CheckboxNode<T>(this, userNode, null);
    this.nodes.push(node);
  }

  public GetView(): JQuery<HTMLElement> {
    return this.rootView;
  }

  public AddEventListener(listener: (node: ICheckboxNode<T>, e: CheckboxTreeViewEvent) => boolean): void {
    this.onEventListeners.push(listener);
  }
  
  public GetRootNodes(): Array<CheckboxNode<T>> {
    return this.nodes;
  }

  public onRemoveRoot(node: ICheckboxNode<T>): void {
    for (const i of this.nodes) {
      if (i === node) {
        this.nodes.splice(this.nodes.indexOf(i), 1);
        return;
      }
    }
  }

  public onContructItem(node: ICheckboxNode<T>, isRoot: boolean): JQuery<HTMLElement> {
    const view = $('<li></li>');
    let contentWrapper: JQuery<HTMLElement> = null;
    if (node.isLeaf) {
      const a = $(`<a class="item" href="javascript:void(0)">${node.content}</a>`);
      contentWrapper = a;
      view.append(a);
    }
    else {
      const tempID = GenerateUniqueID();
      const listCheckbox = $(`<input class="item" type="checkbox" id="${tempID}">`);
      listCheckbox.change(() => {
        if (listCheckbox.prop('checked')) {
          listCheckbox.siblings('ul').attr('style', 'display:block;').slideDown(200);
        }
        else {
          listCheckbox.siblings('ul').attr('style', 'display:none;').slideUp(200);
        }
      });
      const label = $(`<label class="item" for="${tempID}">${node.content}</label>`);
      contentWrapper = label;
      const ul = $('<ul style="display: none"></ul>');
      view.append(listCheckbox, label, ul);
    }
    const id = GenerateUniqueID();
    const materialCheckbox = $(`<div class="material-checkbox">
      <input id="${id}" type="checkbox">
      <label for="${id}"></label>    
      </div>`);

    materialCheckbox.find('>input[type=checkbox]').change(function(){
      const cb = $(this);
      node.checked = cb.prop('checked');
    });
    contentWrapper.prepend(materialCheckbox);

    if (this.config.showDelete) {
      const deleteBtn = $(
        `<button class="delete-button">
          <i class="material-icons">close</i>
        </button>`);
      const that = this;
      deleteBtn.click(function(e: Event) {
        e.stopPropagation();
        $(this).blur();
        for (const listener of that.onEventListeners) {
          listener(node, CheckboxTreeViewEvent.Delete);
        }
      });
      contentWrapper.append(deleteBtn);
    }

    if (isRoot) {
      this.rootView.append(view);
    }
    return view;
  }

  public onAppendNode(
    parent: ICheckboxNode<T>, child: ICheckboxNode<T>): void {
    
    parent.view.find('>ul').append(child.view);
  }

  public onDeleteNode(parent: ICheckboxNode<T>, child: ICheckboxNode<T>): void {
    child.view.remove();
  }

  public onCheckNode(node: ICheckboxNode<T>): void {
    let view: JQuery<HTMLElement> = null;
    if (node.isLeaf) {
      view = node.view.find('>a.item>div.material-checkbox>input[type=checkbox]');
    }
    else {
      view = node.view.find('>label.item>div.material-checkbox>input[type=checkbox]');
    }
    if (!view.prop('checked')) {
      view.prop('checked', true);
    }
  }

  public onUncheckNode(node: ICheckboxNode<T>): void {
    let view: JQuery<HTMLElement> = null;
    if (node.isLeaf) {
      view = node.view.find('>a.item>div.material-checkbox>input[type=checkbox]');
    }
    else {
      view = node.view.find('>label.item>div.material-checkbox>input[type=checkbox]');
    }
    if (view.prop('checked')) {
      view.prop('checked', false);
    }
  }

  public ExtractCheckedRootInfoList(): T[] {
    return [];
  }
}

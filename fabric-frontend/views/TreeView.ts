import { GenerateUniqueID } from '../utils/GenerateUniqueID';
import { TreeNode } from '../utils/Tree';
import { IView } from './View';
const $ = require('jquery');

import './TreeView.scss';

/**
 * UserNode
 * 用户提供的节点信息
 * TreeView会将其中的内容提取出来构造树结构
 */
export class UserNode<T> implements TreeNode<T> {
  // 用户的自定义标记
  public info: T;
  // 展示在TreeView每个item中的内联元素
  public content: string;
  // 字节点数组
  public children: Array<UserNode<T>>;

  public isLeaf: boolean;

  constructor(info: T, content: string, isLeaf: boolean) {
    this.info = info;
    this.content = content;
    this.children = [];
    this.isLeaf = isLeaf;
  }
  // TODO 加入收起、展开初始状态的flag
  // TODO 完善封装性
}

export interface INode<T> extends TreeNode<T>{
  info: T;
  content: string;
  view: JQuery<HTMLElement>;
  isLeaf: boolean;
  children: Array<INode<T>>;
  Delete(): void;
}

/**
 * 这个接口让Node知道对应情况发生时如何操作View
 */
export interface IViewProvider<T> {
  // 构造根元素的时候调用（暂时没用到）
  // onContructRootWrapper(): JQuery<HTMLElement>;
  // 需要构造一个新的item时调用
  onContructItem(node: INode<T>, isRoot: boolean): JQuery<HTMLElement>;
  // 子节点添加到父节点时调用
  onAppendNode(parent: INode<T>, child: INode<T>): void;
  // 从父节点删除子节点时使用
  onDeleteNode(parent: INode<T>, child: INode<T>): void;
}

/**
 * 树结构的节点
 * 实际上整个树就是一个根节点
 */
export class Node<T> implements INode<T>{

  public info: T; 
  public parent: Node<T>;
  public children: Array<Node<T>>;
  public provider: IViewProvider<T>;
  public content: string;
  public view: JQuery<HTMLElement>;

  public isLeaf: boolean;

  constructor(provider: IViewProvider<T>, userNode: UserNode<T>, parent: Node<T>) {
    // 设置好各项参数
    this.info = userNode.info;
    this.content = userNode.content;
    this.isLeaf = userNode.isLeaf;
    this.children = [];
    this.provider = provider;
    this.parent = parent;

    this.view = this.provider.onContructItem(this, (parent == null));

    if (!this.isLeaf) {
      for (const i of userNode.children) {
        this.Append(i);
      }
    }
  }

  public Append(node: UserNode<T>): void {
    if (this.isLeaf) { 
      return;
    }

    const newNode = new Node<T>(this.provider, node, this);
    this.children.push(newNode);
    // 调用这个函数完成对View的操作
    this.provider.onAppendNode(this, newNode);
  }

  public Delete(): void {
    this.provider.onDeleteNode(this.parent, this);
    // 然后从父元素的children删除自己
    if (this.parent != null) {
      const brothers = this.parent.children;
      const index = brothers.indexOf(this);
      if (index !== -1){
        brothers.splice(brothers.indexOf(this), 1);
      }
    }
  }

  public DeleteChild(node: Node<T>): void {
    if (this.isLeaf) { 
      return;
    }
    for (const i of this.children) {
      this.provider.onDeleteNode(this, i);
    }
    this.children = [];
  }

  public FindUnique(comparator: (info: T) => boolean): Node<T> {
    if (comparator(this.info)) {
      return this;
    }
    else {
      if (this.isLeaf){
        return null;
      }
      for (const i of this.children) {
        const result = i.FindUnique(comparator);
        if (result != null) { return result; }
      }
    }
    return null;
  }

  public Children(): Array<Node<T>> {
    if (this.isLeaf) {
      return;
    }
    return this.children;
  }
}

export class TreeViewConfig {
  // 是否显示图标
  public showIcon: boolean;
  // 是否允许删除
  public showDelete: boolean;
  // 展开某个节点时是否收起同级别其他节点
  public slideUpOthers: boolean;
  // 点击某个节点时是否滚动到该节点
  public scrollToView: boolean;
  public expandAll?: boolean;
}

/**
 * TreeView的事件
 */
export enum TreeViewEvent {
  Click, Delete,
}

export class TreeView<T> implements IView, IViewProvider<T> {
  
  private nodes: Array<Node<T>>;

  private rootView: JQuery<HTMLElement>;

  private onEventListeners: Array<(node: INode<T>, e: TreeViewEvent) => boolean>;

  private config: TreeViewConfig;

  constructor(nodes: Array<UserNode<T>>, config: TreeViewConfig) {
    this.config = config;
    this.onEventListeners = [];

    if (this.config.showIcon) {
      this.rootView = $('<ul class="tree-view animated"></ul>');
    }
    else {
      this.rootView = $('<ul class="tree-view-no-icon animated"></ul>');
    }

    this.nodes = [];
    for (const i of nodes) {
      const node = new Node<T>(this, i, null);
      this.nodes.push(node);
    }
  }

  public GetView(): JQuery<HTMLElement> {
    return this.rootView;
  }

  /**
   * 添加事件监听器
   * @param listener 监听器
   * @returns 返回true则该事件会发生实际作用，反之不会
   * 例如，非叶子节点的Click事件导致列表收起或展开，如果返回false那么没有对应的效果
   */
  public AddEventListener(listener: (node: INode<T>, e: TreeViewEvent) => boolean): void {
    this.onEventListeners.push(listener);
  }

  /**
   * 获取所有根节点
   * 用户使用这种方式拿到树结构并进行操作
   */
  public GetRootNodes(): Array<Node<T>> {
    return this.nodes;
  }

  public onContructItem(node: INode<T>, isRoot: boolean): JQuery<HTMLElement> {
    
    const view = $('<li></li>');
    let contentWrapper: JQuery<HTMLElement> = null;
    if (node.isLeaf) {
      const a = $(`<a class="item" href="javascript:void(0)">${node.content}</a>`);
      contentWrapper = a;
      a.click(() => {
        for (const listener of this.onEventListeners) {
          listener(node, TreeViewEvent.Click);
        }
      });
      view.append(a);
    }
    else {
      const id = GenerateUniqueID();
      const checkbox = $(`<input class="item" type="checkbox" id="${id}">`);
      if (this.config.expandAll) {
        checkbox.prop('checked', true);
      }
      checkbox.change(() => {
        const checked = checkbox.prop('checked');
        let result = true;
        for (const listener of this.onEventListeners) {
          result = result && listener(node, TreeViewEvent.Click);
        }
        if (result) {
          if (checkbox.prop('checked')) {
            checkbox.siblings('ul').attr('style', 'display:none;').slideDown(200);
          }
          else {
            checkbox.siblings('ul').attr('style', 'display:block;').slideUp(200);
          }
        }
        else {
          checkbox.prop('checked', !checked);
        }
      });
      const label = $(`<label class="item" for="${id}">${node.content}</label>`);
      contentWrapper = label;
      const ul = $('<ul></ul>');
      view.append(checkbox, label, ul);
    }

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
          listener(node, TreeViewEvent.Delete);
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
    parent: INode<T>, child: INode<T>): void {
    parent.view.find('>ul').append(child.view);
  }

  public onDeleteNode(parent: INode<T>, child: INode<T>): void{
    child.view.remove();
  }
}

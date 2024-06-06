import { IView } from './View';
const $ = require('jquery');

import './LoaderView.css';

/**
 * 一个旋转的圈圈，没有内容
 */
export class LoaderView implements IView {
  private view: JQuery<HTMLElement>;
  constructor() {
    this.view = $(`<div class="loader"></div>`);
  }

  public GetView(): JQuery<HTMLElement> {
    return this.view;
  }
}

export class LoaderContentView implements IView {
  
  // private _content: JQuery<HTMLElement>;
  private view: JQuery<HTMLElement>;

  constructor() {
    this.view = $(`
      <div class="loader-wrapper">
        <div class="loader"></div>
        <div class="content"></div>
      </div>
    `);
  }

  public set content(content: JQuery<HTMLElement>) {
    // this._content = content;
    const contentView = this.view.find('.content');
    contentView.empty().append(content);
  }

  public GetView(): JQuery<HTMLElement> {
    return this.view;
  }
}

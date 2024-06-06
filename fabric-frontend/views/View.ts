// @ts-ignore: '$' is declared but its value is never read.
import * as $ from 'jquery';

export interface IView {
  /**
   * 获得对应的jquery对象，用户将这个对象加入到页面 
   */
  GetView(): JQuery<HTMLElement>;
}

export interface ManagedView {
  /**
   * 给出一个view让类对象托管。
   * @param view 
   */
  Manage(view: JQuery<HTMLElement>): void;
}

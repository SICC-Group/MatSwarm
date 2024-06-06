const $ = require('jquery');
import { IView } from './View';

export enum ButtonSize {
  Small, Normal, Large,
}

export function CreateButtonGroupView<T>(
  names: string[],
  values: T[],
  onClickHandler: (value: T) => boolean, 
  buttonSize: ButtonSize = ButtonSize.Normal, 
  isSingle: boolean = true, 
  defaultValue: T) {

  const rootView = $('<div class="btn-group" role="group"></div>');
  if (buttonSize === ButtonSize.Large) {
    rootView.addClass('btn-group-lg');
  }
  else if (buttonSize === ButtonSize.Small) {
    rootView.addClass('btn-group-sm');
  }
  
  for (let i = 0; i < names.length; ++i) {
    const name = names[i];
    const view = $('<button type="button" class="btn btn-default">' + name + '</button>');

    if (defaultValue === values[i]){
      view.addClass('btn-primary');
    }

    view.click(() => {
      const ret = onClickHandler(values[i]);
      if (ret) {
        if (isSingle){
          rootView.children('button').removeClass('btn-primary');
        }
        view.addClass('btn-primary');
      }
    });

    rootView.append(view);
  }

  return rootView;
}

export class ButtonGroupView<T> implements IView {

  private onChangeListeners: Array<(oldvalue: T, newValue: T) => void>;
  private view: JQuery<HTMLElement>;
  private _value: T;
  private values: T[];
  private defaultValue: T;

  constructor(
    names: string[],
    values: T[],
    defaultValue?: T) {

    this.onChangeListeners = [];
    this.values = values;
    this.defaultValue = defaultValue;
    this._value = this.defaultValue;
    this.view = $('<div class="btn-group btn-group-lg" role="group"></div>');
    for (let i = 0; i < names.length; ++i) {
      const name = names[i];
      const value = values[i];
      const view = $(`<button type="button" class="btn btn-default">${name}</button>`);
      if (defaultValue === value) { view.addClass('btn-primary'); }
      view.click(() => {
        this.view.children('button').removeClass('btn-primary');
        view.addClass('btn-primary');
        this.value = value;
      });
      this.view.append(view);
    }
  }

  public get value(): T {
    return this._value;
  }

  public set value(src: T) {
    if (this._value !== src) {
      const old = this._value;
      this._value = src;
      const index = this.values.indexOf(src);
      this.view.children('button').removeClass('btn-primary');
      if (index !== -1) {
        $(this.view.children('button').get(index)).addClass('btn-primary');
      }
      for (const i of this.onChangeListeners) {
        i(old, this.value);
      }
    }
  }

  /**
   * 禁用某个选项，如果该选项刚好是当前选中的，则使用用户给出的newValue值
   * @param value 
   * @param newValue 
   */
  public Disable(value: T, newValue?: T): void {
    const index = this.values.indexOf(value);
    $(this.view.children('button').get(index)).prop('disabled', true);
    if (this.value === value) {
      this.value = newValue;
    }
  }

  public Enable(value: T): void {
    const index = this.values.indexOf(value);
    $(this.view.children('button').get(index)).prop('disabled', false);
  }

  public EnableAll(): void {
    for (const i of this.values) {
      this.Enable(i);
    }
  }

  /**
   * 值改变时触发
   * @param listener 
   */
  public addOnChangeListener(listener: (oldvalue: T, newValue: T) => void): void {
    this.onChangeListeners.push(listener);
  }

  public GetView(): JQuery<HTMLElement> {
    return this.view;
  }
}

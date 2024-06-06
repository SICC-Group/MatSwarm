import { Enum } from '../utils/Enum';
import { IView } from './View';
const $ = require('jquery');

import './SelectorView.less';

export interface Divider<T> {
  name: string;
  before: T;
}

export class SelectorView<T> implements IView {
  
  private view: JQuery<HTMLElement>;
  private members: Enum<T>;
  private _value: T;
  private onChooseListeners: Array<(old: T, newValue: T) => boolean>;

  constructor(members: Enum<T>, defaultValue: T, dividers?: Array<Divider<T>>) {
    this.members = members;
    this.onChooseListeners = [];

    this.view = $(`
      <div class="selector">
        <button class="btn btn-default">${django.gettext('[Select a choice]')}</button>
        <span class="caret"></span>
        <ul class="hide">
        </ul>
      </div>
    `);
    const ul = this.view.find('ul');
    const button = this.view.find('button');

    const globalClickListener = (event: any) => {
      if (!$(event.target).closest('#menucontainer').length) {
        if (!ul.hasClass('hide')) {
          ul.addClass('hide');
          $(document).unbind('click', globalClickListener);
        }
      }  
    };
    button.click(function(e) {
      $(this).blur();
      e.stopPropagation();
      ul.removeClass('hide');
      $(document).bind('click', globalClickListener);
    });
    members.ForEach((name, value) => {
      const li = $(`<li><a href="javascript:void(0)">${name}</a></li>`);
      li.click(() => {
        if (this._value === value) { return; }
        let ret = true;
        for (const i of this.onChooseListeners) {
          ret = ret && i(this._value, value);
        }
        if (ret) {
          this._value = value;
          this.view.find('button').text(name);
          ul.addClass('hide');
          $(document).unbind('click', globalClickListener);
        }
      });

      if (dividers != null) {
        for (const i of dividers) {
          if (i.before === value) {
            ul.append($(`<li class="divider"><a href="javascript:void(0)"><bold>${i.name}</bold></a></li>`));
            break;
          }
        }
      }
      ul.append(li);
    });
    this.Choose(defaultValue);
  }

  public Choose(value: T): void {
    this._value = value;
    this.view.find('button').text(this.members.ValueToName(value));
  }

  public AddOnChooseListener(listener: (old: T, newValue: T) => boolean) {
    this.onChooseListeners.push(listener);
  }

  public GetView(): JQuery<HTMLElement> {
    return this.view;
  }

  public Value(): T {
    return this._value;
  }
}

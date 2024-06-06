import { FieldType } from '../apis/define/FieldType';
import { Search } from '../apis/define/search';
import { ChoiceToSelectorView } from '../utils/Template';
import { SelectorView } from './SelectorView';
import { IView } from './View';

const $ = require('jquery');

/**
 * 1-6，等于类，文本框，需要额外处理number和单位
 * 7-12，字符串匹配类，文本框
 * 13-14，输入多个条件，需要额外处理number和单位
 * 0，15，Null判断，没有内容
 * 16-18，表格量词，不处理
 * 0和19，存在性操作符，没有内容
 * 
 * 如果字段是选项，那么要根据misc渲染一个selector
 */

export class ConditionContentView implements IView {

  private view: JQuery<HTMLElement>;
  private valView: JQuery<HTMLElement>;
  private choiceView: SelectorView<string>;

  constructor(op: Search.Operator, fieldType: FieldType, misc: any) {
    this.view = null;
    this.choiceView = null;
    this.valView = null;
    if (op === 'eq' || op === 'ne' || op === 'gt' || op === 'gte' || op === 'lt' || op === 'lte' ||
        op === 'contains' || op === 'ncontains' || op === 'startswith' || op === 'nstartswith' ||
        op === 'endswith' || op === 'nendswith') {
      if (fieldType !== FieldType.Choice) {
        this.view = $('<input type="text" class="form-control" ></input>');
        this.valView = this.view;
      }
      else {
        this.choiceView = ChoiceToSelectorView(misc);
        this.view = this.choiceView.GetView();
      }
    }
    // 否则两个都是null
  }

  public GetValue(): string {
    if (this.choiceView != null) {
      return this.choiceView.Value();
    }
    if (this.valView != null) {
      return this.valView.val().toString();
    }
    return null;
  }

  public GetView(): JQuery<HTMLElement> {
    return this.view;
  }
}

export class NumberConditionContentView implements IView {

  private view: JQuery<HTMLElement>;
  private valView: JQuery<HTMLElement>;

  constructor(op: Search.Operator, fieldType: FieldType, misc: any) {
    this.view = null;
    if (op === Search.Operator.Equal || op === Search.Operator.NotEqual || 
      op === Search.Operator.Greater || op === Search.Operator.GreaterOrEqual || 
      op === Search.Operator.Less || op === Search.Operator.LessOrEqual) {
      if (misc != null && misc.unit != null) {
        this.view = $(`<div class="input-group"><input type="number" class="form-control" ><span class="input-group-addon">${misc.unit}</span></div>`);
        this.valView = this.view.find('input');
      }
      else {
        this.view = $('<input type="number" class="form-control" ></input>');
        this.valView = this.view;
      }
      
    }
  }

  public GetView(): JQuery<HTMLElement> {
    return this.view;
  }

  public GetValue(): number {
    return Number(this.valView.val());
  }
}

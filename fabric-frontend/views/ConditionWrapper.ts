import { FieldType } from '../apis/define/FieldType';
import { Search } from '../apis/define/search';
import { ConditionType } from '../apis/Search';
import { Info as TemplateInfo} from '../TemplateToTreeForSearch';
import { UserNode } from '../views/TreeView';
import { ConditionSelector } from './ConditionSelector';
import { ConditionView, CreateConditionView } from './ConditionView';

const $ = require('jquery');

import './ConditionWrapper.scss';

/**
 * 元数据部分和模板使用同一套机制
 * category、time暂时不支持
 */
export function GetMetaUserNodes(): Array<UserNode<TemplateInfo>> {
  return [
    new UserNode<TemplateInfo>({ path: 'title', type: FieldType.String, required: true, name: django.gettext('Title') }, django.gettext('Title'), true),
    new UserNode<TemplateInfo>({ path: 'doi', type: FieldType.String, name: django.gettext('DOI') }, django.gettext('DOI'), true),
    new UserNode<TemplateInfo>({ path: 'abstract', type: FieldType.String, name: django.gettext('Abstract') }, django.gettext('Abstract'), true),
    new UserNode<TemplateInfo>({ path: 'author', type: FieldType.String, name: django.gettext('Author') }, django.gettext('Author'), true),
    new UserNode<TemplateInfo>({ path: 'downloads', type: FieldType.Number, name: django.gettext('Downloads') }, django.gettext('Downloads'), true),
    new UserNode<TemplateInfo>({ path: 'views', type: FieldType.Number, name: django.gettext('Views') }, django.gettext('Views'), true),
    new UserNode<TemplateInfo>({ path: 'score', type: FieldType.Number, name:  django.gettext('Score') }, django.gettext('Score'), true),
  ];
}

export class ConditionWrapper extends ConditionView {

  private selector: ConditionSelector;
  private conditionView: ConditionView;
  private nodes: Array<UserNode<TemplateInfo>>;

  constructor(nodes?: Array<UserNode<TemplateInfo>>) {
    super(null);
    this.nodes = nodes;
    this.conditionView = null;
    this.view = $(`<div class="col-xs-12 condition-wrapper-1"></div>`);
    this.selector = new ConditionSelector(nodes);
    this.selector.SetOnConditionSelectedListener((type, info) => {
      this.SelectCondition(type, info);
    });
    // this.view.append(this.selector.GetView());
    this.SelectCondition(ConditionType.And, null);
  }

  public SelectCondition(type: ConditionType, info: TemplateInfo): void {
    const condView = CreateConditionView(type, info, this.nodes);
    condView.SetOnDeleteListener(() => {
      this.conditionView.GetView().detach();
      this.conditionView = null;
      this.view.append(this.selector.GetView());
    });
    if (this.conditionView != null) {
      this.conditionView.GetView().detach();
    }
    this.conditionView = condView;
    this.selector.GetView().detach();
    this.view.empty();
    this.view.append(this.conditionView.GetView());
  }

  public SetTemplate(nodes?: Array<UserNode<TemplateInfo>>): void {
    this.nodes = nodes;
    this.selector.GetView().detach();
    this.selector.SetTemplate(nodes);
    this.SelectCondition(ConditionType.And, null);
  }

  public Disable(): void {
    this.selector.Disable();
  }

  public Enable(): void { 
    this.selector.Enable();
  }

  public GetCondition(): Search.Condition.Any {
    if (this.conditionView != null) {
      return this.conditionView.GetCondition();
    }
    else {
      return null;
    }
  }
}
export class ConditionWrapper_2 extends ConditionView {

  private selector: ConditionSelector;
  private conditionView: ConditionView;
  private nodes: Array<UserNode<TemplateInfo>>;

  constructor(nodes?: Array<UserNode<TemplateInfo>>) {
    super(null);
    this.nodes = nodes;
    this.conditionView = null;
    this.view = $(`<div class="col-xs-12 condition-wrapper-2"></div>`);
    this.selector = new ConditionSelector(nodes);
    this.selector.SetOnConditionSelectedListener((type, info) => {
      this.SelectCondition(type, info);
    });
    // this.view.append(this.selector.GetView());
    this.SelectCondition(ConditionType.And, null);
  }

  public SelectCondition(type: ConditionType, info: TemplateInfo): void {
    const condView = CreateConditionView(type, info, this.nodes);
    condView.SetOnDeleteListener(() => {
      this.conditionView.GetView().detach();
      this.conditionView = null;
      this.view.append(this.selector.GetView());
    });
    if (this.conditionView != null) {
      this.conditionView.GetView().detach();
    }
    this.conditionView = condView;
    this.selector.GetView().detach();
    this.view.empty();
    this.view.append(this.conditionView.GetView());
  }

  public SetTemplate(nodes?: Array<UserNode<TemplateInfo>>): void {
    this.nodes = nodes;
    this.selector.GetView().detach();
    this.selector.SetTemplate(nodes);
    this.SelectCondition(ConditionType.And, null);
  }

  public Disable(): void {
    this.selector.Disable();
  }

  public Enable(): void { 
    this.selector.Enable();
  }

  public GetCondition(): Search.Condition.Any {
    if (this.conditionView != null) {
      return this.conditionView.GetCondition();
    }
    else {
      return null;
    }
  }
}

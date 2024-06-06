import { FieldType } from '../apis/define/FieldType';
import { ConditionType, FieldTypeToOperatorList } from '../apis/Search';
import { Search } from '../apis/define/search';
import { ArrayMiscToUserNode, Info as TemplateInfo, TableMiscToUserNode} from '../TemplateToTreeForSearch';
import { GenerateUniqueID } from '../utils/GenerateUniqueID';
import { Enum } from '../utils/Enum';
import { UserNode } from '../views/TreeView';
import { ConditionContentView, NumberConditionContentView } from './ConditionContentView';
import { ConditionSelector } from './ConditionSelector';
import { SelectorView } from './SelectorView';
import { IView } from './View';

const $ = require('jquery');
import './ConditionView.scss';
export abstract class ConditionView implements IView{
  public onDeleteListener: () => void;
  protected view: JQuery<HTMLElement>;

  constructor(onDelete?: () => void) { 
    this.onDeleteListener = onDelete;
  }

  public GetView(): JQuery<HTMLElement> {
    return this.view;
  }

  public abstract GetCondition(): Search.Condition.Any;

  public SetOnDeleteListener(listener: () => void) {
    this.onDeleteListener = listener;
  }
}

/**
 * 一般字段条件
 */
export class FieldConditionView extends ConditionView {
  private info: TemplateInfo;
  private opDropdown: SelectorView<Search.Operator>;
  private contentView: ConditionContentView | NumberConditionContentView;

  constructor(info: TemplateInfo, onDelete?: () => void) {
    super(onDelete);
    this.info = info;
    this.view = $(`
      <div class="condition" style="background: #FFF">
        <div class="selector-view-wrapper">
          <div class="title-wrapper">
            <span>${this.info.name}&nbsp;</span>
            <div class="dropdown-wrapper">
            </div>
          </div>
          <a class="delete-button" href="javascript:void(0)"><i class="fa fa-times" aria-hidden="true"></i></a>
        </div>
        <div class="content-wrapper">
        </div>
      </div>
    `);
    this.view.find('.delete-button').click(() => {
      if (this.onDeleteListener) {
        this.onDeleteListener();
      }
    });
    const ops = FieldTypeToOperatorList(this.info.type, this.info.required);
    const opNames = ops.map(Search.Operator.toString);
    const en = new Enum<Search.Operator>(opNames, ops);
    this.opDropdown = new SelectorView(en, ops[0]);
    this.opDropdown.AddOnChooseListener((old, newValue) => {
      // 选项改变时触发下面content的更新
      this.SetContent(newValue);
      return true;
    });
    this.view.find('.dropdown-wrapper').append(this.opDropdown.GetView());
    this.SetContent(ops[0]);
  }

  public GetCondition(): Search.Condition.Any {
    const c: Search.Condition.Field = { field: this.info.path, op: this.opDropdown.Value(), val: ''};

    if (c.op !== Search.Operator.NotNull && c.op !== Search.Operator.Null){
      c.val = this.contentView.GetValue();
      if (c.val == null) {
        return null;
      }
    }
    return c;
  }

  public SetContent(op: Search.Operator): void {
    const wrapper = this.view.find('> .content-wrapper');
    if (this.contentView != null) {
      const view = this.contentView.GetView();
      if (view != null) {
        view.detach();
      }
      this.contentView = null;
    }
    wrapper.empty();
    if (this.info.type !== FieldType.Number) {
      this.contentView = new ConditionContentView(op, this.info.type, this.info.misc);
    }
    else {
      this.contentView = new NumberConditionContentView(op, this.info.type, this.info.misc);
    }
    wrapper.append(this.contentView.GetView());
  }
}
/**
 * 数组和表格的条件
 */
export class TableArrayConditionView extends ConditionView {
  private condSelector: ConditionSelector;
  private condition: ConditionView;
  private info: TemplateInfo;
  private opDropdown: SelectorView<Search.Operator>;
  private contentID: string;

  constructor(info: TemplateInfo, onDelete?: () => void) {
    super(onDelete);
    this.info = info;
    this.condition = null;
    // 准备nodes
    let nodes: Array<UserNode<TemplateInfo>> = null;
    if (this.info.type === FieldType.Array) {
      nodes = [ArrayMiscToUserNode(this.info.misc, this.info.path)];
      // console.log(ArrayMiscToUserNode(this.info.misc, this.info.path));
    }
    else {
      nodes = TableMiscToUserNode(this.info.misc, this.info.path).children;
      // console.log(TableMiscToUserNode(this.info.misc, this.info.path));
    }

    const id = GenerateUniqueID();
    this.contentID = GenerateUniqueID();
    this.view = $(`
      <div class="condition" style="background: #FFF">
        <div class="selector-view-wrapper">
          <div class="title-wrapper">
            <span>${this.info.name}</span>
            <div class="dropdown-wrapper">
            </div>
          </div>
          <a id="${id}" class="delete-button" href="javascript:void(0)"><i class="fa fa-times" aria-hidden="true"></i></a>
        </div>
        <div id="${this.contentID}" class="condition-content"></div>
      </div>
    `);
    this.view.find(`#${id}`).click(() => {
      // console.log('delete');
      if (this.onDeleteListener) {
        this.onDeleteListener();
      }
    });
    const ops = FieldTypeToOperatorList(this.info.type, this.info.required);
    const opNames = ops.map(Search.Operator.toString);
    const en = new Enum<Search.Operator>(opNames, ops);
    this.opDropdown = new SelectorView(en, ops[0]);
    this.opDropdown.AddOnChooseListener((old, newValue) => {
      // 选项改变时触发下面content的更新
      this.SetContent(newValue);
      return true;
    });
    this.view.find('.dropdown-wrapper').append(this.opDropdown.GetView());
    
    this.condSelector = new ConditionSelector(nodes);
    this.condSelector.SetOnConditionSelectedListener((condType, condInfo) => {
      this.condSelector.GetView().detach();
      const newCond = CreateConditionView(condType, condInfo, nodes);
      this.condition = newCond;
      newCond.SetOnDeleteListener(() => {
        newCond.GetView().detach();
        this.condition = null;
        this.view.find(`#${this.contentID}`).append(this.condSelector.GetView());
      //   const index = this.conditions.indexOf(newCond);
      //   this.conditions.splice(index, 1);
      });
      this.view.find(`#${this.contentID}`).append(newCond.GetView());
    });

    this.SetContent(ops[0]);
  }

  public SetContent(op: Search.Operator): void {
    const content = this.view.find(`#${this.contentID}`);
    this.condSelector.GetView().detach();
    if (op === Search.Operator.Null || op === Search.Operator.NotNull) {
      content.empty();
    }
    else {
      content.append(this.condSelector.GetView());
    }
  }

  public GetCondition(): Search.Condition.Any {
    const c: Search.Condition.Field = { field: this.info.path, op: this.opDropdown.Value(), val: '' };
    if (c.op !== Search.Operator.NotNull && c.op !== Search.Operator.Null){
      if (this.condition == null) {
        return null;
      }
      c.val = this.condition.GetCondition();
      if (c.val == null) {
        return null;
      }
    }
    return c;
  }
}

const logicEnum = new Enum<ConditionType>([django.gettext('AND'), django.gettext('OR')], [ConditionType.And, ConditionType.Or]);

export class AndOrConditionView extends ConditionView{
  private dropdown: SelectorView<string>;
  private condSelector: ConditionSelector;
  private conditions: ConditionView[];
  
  constructor(type: ConditionType, info: TemplateInfo, nodes: Array<UserNode<TemplateInfo>>, onDelete?: () => void) {
    super(onDelete);
    this.conditions = [];
    if (type === ConditionType.Field){
      throw new Error('Invalid condition type');
    }
    this.view = $(`
      <div class="condition">
        <div class="selector-view-wrapper">
          <div class="dropdown-wrapper">
          </div>
          <a class="delete-button" href="javascript:void(0)"><i class="fa fa-times" aria-hidden="true"></i></a>
        </div>
      </div>
    `);
    this.dropdown = new SelectorView<ConditionType>(logicEnum, type);
    this.view.find('.dropdown-wrapper').append(this.dropdown.GetView());
    this.view.find('.delete-button').click(() => {
      if (this.onDeleteListener) {
        this.onDeleteListener();
      }
    });

    this.condSelector = new ConditionSelector(nodes);
    this.condSelector.SetOnConditionSelectedListener((condType, condInfo) => {
      this.condSelector.GetView().detach();
      const newCond = CreateConditionView(condType, condInfo, nodes);
      this.conditions.push(newCond);
      newCond.SetOnDeleteListener(() => {
        newCond.GetView().detach();
        const index = this.conditions.indexOf(newCond);
        this.conditions.splice(index, 1);
      });
      this.view.append(newCond.GetView()).append(this.condSelector.GetView());
    });
    this.view.append(this.condSelector.GetView());
  }
  public GetCondition(): Search.Condition.Any {
    if (this.dropdown.Value() === ConditionType.Or) {
      const or: Search.Condition.Or = { or: [] };
      for (const i of this.conditions) {
        or.or.push(i.GetCondition());
      }
      if (or.or.length === 0) {
        return null;
      }
      return or;
    }
    else {
      const and: Search.Condition.And = { and: [] };
      for (const i of this.conditions) {
        and.and.push(i.GetCondition());
      }
      if (and.and.length === 0) {
        return null;
      }
      return and;
    }
  }
}

export function CreateConditionView(type: ConditionType, info: TemplateInfo, nodes: Array<UserNode<TemplateInfo>>): ConditionView {
  if (type === ConditionType.And || type === ConditionType.Or) {
    return new AndOrConditionView(type, info, nodes);
  }
  else if (type === ConditionType.Field) {
    if (info.type !== FieldType.Array && info.type !== FieldType.Table) {
      return new FieldConditionView(info);
    }
    else {
      // 表格和数组
      return new TableArrayConditionView(info);
    }
  }
}

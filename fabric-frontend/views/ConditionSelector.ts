import { FieldType } from '../apis/define/FieldType';
import { ConditionType } from '../apis/Search';
import { Info as TemplateInfo} from '../TemplateToTreeForSearch';
import { TreeView, TreeViewEvent, UserNode } from '../views/TreeView';
import { ButtonGroupView } from './ButtonGroupView';
import { BaseModalWindowView, Effect } from './ModalWindowView';
import { IView } from './View';

const $ = require('jquery');
import './ConditionSelector.scss';
import './ConditionView.scss';

// class CondTypeSelector extends BaseModalWindowView {
//   constructor(callback: (type: ConditionType) => void) {
//     const buttonGroup = new ButtonGroupView<ConditionType>(
//       [django.gettext('Field'), django.gettext('AND'), django.gettext('OR')],
//       [ConditionType.Field, ConditionType.And, ConditionType.Or]);
//     buttonGroup.addOnChangeListener((old, newValue) => {
//       callback(newValue);
//       this.Hide();
//     });
//     const wrapper = $(`<div class="button-group-wrapper"><h4>${django.gettext('Select condition type')}</h4></div>`);
//     wrapper.append(buttonGroup.GetView());
//     super({
//       clickOverlayToClose: true,
//       content: wrapper,
//       effect: Effect.FadeInAndScale,
//       blur: true,
//     });
//   }
// }

class TemplateFieldSelector extends BaseModalWindowView {
  constructor(nodes: Array<UserNode<TemplateInfo>>, callback: (node: UserNode<TemplateInfo>) => void) {
    const treeView = new TreeView<TemplateInfo>(nodes, {
      showIcon: false,
      showDelete: false,
      slideUpOthers: false,
      scrollToView: false,
      expandAll: true,
    });

    treeView.AddEventListener((node, e) => {
      if (e === TreeViewEvent.Click) {
        if (node.info.type === FieldType.Range) {
          return false;
        }
        else {
          callback(node);
          this.Hide();
        }
      }
      return false;
    });

    super({
      clickOverlayToClose: true,
      content: treeView.GetView(),
      effect: Effect.FadeInAndScale,
      blur: true,
    });
  }
}

export class ConditionSelector implements IView {
  private view: JQuery<HTMLElement>;
  // private condSelector: CondTypeSelector;
  private templateFieldSelector: TemplateFieldSelector;
  private listener: (type: ConditionType, info?: TemplateInfo) => void;

  constructor(nodes?: Array<UserNode<TemplateInfo>>) {
    this.view = $(`<div class="condition-selector">${django.gettext('Click to add condition.')}</div>`);
    this.listener = null;
    this.SetTemplate(nodes);
  }

  public SetTemplate(nodes?: Array<UserNode<TemplateInfo>>): void {
    // 无论如何都要清空内容
    this.view.empty();
    if (nodes == null) {
      this.Disable();
    }
    else {
      this.templateFieldSelector = new TemplateFieldSelector(nodes, (node) => {
        if (this.listener) {
          this.listener(ConditionType.Field, node.info);
        }
      });
      this.Enable();
    }
  }

  public SetOnConditionSelectedListener(listener: (type: ConditionType, info?: TemplateInfo) => void){
    this.listener = listener;
  }

  public GetView(): JQuery<HTMLElement> {
    return this.view;
  }

  /**
   * 禁用选择器。在模板未设置时自动禁用
   * 只在用户没有选择字段时有用
   */
  public Disable(): void {
    this.view.unbind('click').addClass('disabled').text(django.gettext('Select a template first.'));
  }

  /**
   * 启用选择器。在模板未设置时没有作用
   * 只在用户没有选择字段时有用
   * 用户设置模板后自动启用
   */
  public Enable(): void {
    this.view.removeClass('disabled').text(django.gettext('Click to add condition.'));

    const buttonGroup = new ButtonGroupView<ConditionType>(
      [django.gettext('Field'), django.gettext('AND'), django.gettext('OR')],
      [ConditionType.Field, ConditionType.And, ConditionType.Or]);
    buttonGroup.addOnChangeListener((old, t) => {
      buttonGroup.value = null;
      if (t === ConditionType.And || t === ConditionType.Or) {
        if (this.listener) {
          this.listener(t);
        }
      }
      else if (t === ConditionType.Field) {
        this.templateFieldSelector.Show();
      }
    });
    const wrapper = $(`<div class="button-group-wrapper"><h4>${django.gettext('Click to add condition.')}</h4></div>`);
    wrapper.append(buttonGroup.GetView());
    this.view.empty().append(wrapper);
  }
}

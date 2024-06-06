import { FieldType } from '../apis/define/FieldType';
import {  Divider, SelectorView } from '../views/SelectorView';
import { Enum } from './Enum';
import { TreeNode } from './Tree';

export enum TokenType {
  Field,
  RangeValue,
  ArrayContent,
  GeneratorOption,
  TableColumn,
}

export function FieldTypeToString(f: FieldType): string {
  switch (f) {
    case FieldType.String:    return `[${django.gettext('String')}]`;
    case FieldType.Number:    return `[${django.gettext('Number')}]`;
    case FieldType.Range:     return `[${django.gettext('Range')}]`;
    case FieldType.Image:     return `[${django.gettext('Image')}]`;
    case FieldType.File:      return `[${django.gettext('File')}]`;
    case FieldType.Choice:    return `[${django.gettext('Choice')}]`;
    case FieldType.Array:     return `[${django.gettext('Array')}]`;
    case FieldType.Table:     return `[${django.gettext('Table')}]`;
    case FieldType.Container: return `[${django.gettext('Container')}]`;
    case FieldType.Generator: return `[${django.gettext('Generator')}]`;
    default: {
      return `[${django.gettext('Parse error')}]`;
    }
  }
}

export interface ParserHandlerResult<T> {
  /**
   * 用户提供的新节点，如果是null那么不继续解析
   */
  returnNode?: T;
  /**
   * 对复合类型有效，只有当returnNode不是null时起作用
   * 如果是true那么继续解析复合类型的子节点
   */
  parseChild: boolean;
}

export interface ParserHandler<U> {
  onCreateRoot: () => U;
  handleField: (parent: U, name: string, fieldType: FieldType, tokenType: TokenType, template: any) => ParserHandlerResult<U>;
}

export class Parser<T, Node extends TreeNode<T>>{

  public handler: ParserHandler<Node>;

  constructor(handler: ParserHandler<Node>) {
    this.handler = handler;
  }

  public Parse(template: any): Node {
    const rootNode = this.handler.onCreateRoot();
    this.ContainerParser(rootNode, template);
    return rootNode;
  }

  /**
   * 解析一个字段，注意它会返回一个wrapper
   * @param template 对应模板的misc
   * @param name 给这个字段的名字
   * @param rootPath 根路径
   */
  public ParseOneField(template: any, name: string, tokenType: TokenType, rootPath?: string): Node {
    const rootNode = this.handler.onCreateRoot();
    if (tokenType == null) {
      tokenType = TokenType.Field;
    }
    this.FieldParser(rootNode, tokenType, name, template);
    return rootNode;
  }

  protected FieldParser(parent: Node, tokenType: TokenType, name: string, template: any): void {
    const ret = this.handler.handleField(parent, name, template.t, tokenType, template);
    if (ret.returnNode == null) {
      return;
    }
    parent.children.push(ret.returnNode);

    if (!FieldType.isPrimitive(template.t) && ret.parseChild) {
      if (template.t === FieldType.Container) {
        this.ContainerParser(ret.returnNode, template.misc);
      }
      else if (template.t === FieldType.Array) {
        this.ArrayParser(ret.returnNode, template.misc);
      }
      else if (template.t === FieldType.Table) {
        this.TableParser(ret.returnNode, template.misc);
      }
      else if (template.t === FieldType.Generator) {
        this.GeneratorParser(ret.returnNode, template.misc);
      }
    }
  }

  protected AbstractCompositeParser(parent: Node, template: any, cursorName: string, tokenType: TokenType): void {
    const cursor: string[] = template[cursorName];
    for (const name of cursor) {
      this.FieldParser(parent, tokenType, name, template[name]);
    }
  }

  protected ContainerParser(parent: Node, template: any): void {
    this.AbstractCompositeParser(parent, template, '_ord', TokenType.Field);
  }

  protected GeneratorParser(parent: Node, template: any): void {
    this.AbstractCompositeParser(parent, template, '_opt', TokenType.GeneratorOption);
  }

  protected ArrayParser(parent: Node, template: any): void {
    this.FieldParser(parent, TokenType.ArrayContent, String(Number(template.t)), template);
  }

  protected TableParser(parent: Node, template: any): void {
    this.AbstractCompositeParser(parent, template, '_head', TokenType.TableColumn);
  }
}

export interface ChoiceGroupItem {
  name: string;
  items: string[];
}

export interface ChoiceMisc {
  opt: string[];
  grp: ChoiceGroupItem[];
}

export function ChoiceToSelectorView(choiceMisc: ChoiceMisc): SelectorView<string> {
  let option: string[] = [];
  const dividers: Array<Divider<string>> = [];
  option = option.concat(choiceMisc.opt);
  choiceMisc.grp.map((value) => {
    dividers.push({name: value.name, before: value.items[0]});
    option = option.concat(value.items);
  });
  const en = new Enum<string>(option, option);
  return new SelectorView(en, en.values[0], dividers);
}

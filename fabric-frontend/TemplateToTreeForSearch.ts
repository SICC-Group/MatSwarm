import { FieldType } from './apis/define/FieldType';
import { RawGetTemplate } from './apis/template/Get';
import { FieldTypeToString, Parser, ParserHandler, TokenType } from './utils/Template';
import { TreeView, UserNode } from './views/TreeView';
export interface Info {
  required?: boolean;
  path: string;
  type: FieldType;
  name: string;
  // 特殊的字段要保留额外信息
  misc?: any;
}

function createSearchParserHandler(rootPath?: string): ParserHandler<UserNode<Info>> {
  return {
    onCreateRoot: () => {
      // 这里用一下Null类，最后提取时会把它丢掉
      return new UserNode<Info>({path: rootPath, type: FieldType.Null, name: rootPath}, rootPath, false);
    },
    handleField: (parent, name, fieldType, tokenType, templateContent) => {
      const required = (templateContent.r) || false;
      const misc = templateContent.misc;
      let returnNode = null;
      let parseChild = true;
      let path = parent.info.path + '.' + name;
      if (parent.info.path.length === 0) {
        path = name;
      }

      if (tokenType === TokenType.ArrayContent) {
        path = parent.info.path + '.' + String(fieldType);
      }
      
      if (FieldType.isPrimitive(fieldType)) {
        returnNode = new UserNode<Info>({path, type: fieldType, required, misc, name}, name, true);
        if (fieldType === FieldType.Range) {
          let lb = 'lb';
          let lbText = name + ': ' + django.gettext('Lower bound');
          let ub = 'ub';
          let ubText = name + ': ' + django.gettext('Upper bound');
          if (templateContent.misc.type === 1) {
            lb = 'val', ub = 'err';
            lbText = name + ': ' + django.gettext('Value');
            ubText = name + ': ' + django.gettext('Error value');
          }
          returnNode.isLeaf = false;
          returnNode.children = [
            new UserNode<Info>({path: path + '.' + lb, type: FieldType.Number, required, misc: {}, name: lbText }, lbText, true),
            new UserNode<Info>({path: path + '.' + ub, type: FieldType.Number, required, misc: {}, name: ubText }, ubText, true),
          ];
        }
      }
      else if (FieldType.isComposite(fieldType) || FieldType.isArray(fieldType)) {
        returnNode = new UserNode<Info>({path, type: fieldType, required, misc, name}, name, false);
        if (fieldType === FieldType.Array || fieldType === FieldType.Table) {
          parseChild = false;
          returnNode.isLeaf = true;
        }
      }
      return { returnNode, parseChild };
    },
  };
}

export function TemplateToUserNode(template: any, root?: string): UserNode<Info> {
  if (root == null) {
    root = '';
  }
  const handler: ParserHandler<UserNode<Info>> = createSearchParserHandler(root);
  const parser = new Parser<Info, UserNode<Info>>(handler);
  const result = parser.Parse(template);
  console.log(result);
  return result;
}

function CreateTemplateTreeView(template: any): TreeView<Info> {
  const nodes = TemplateToUserNode(template);
  // 去掉顶层节点
  return new TreeView<Info>(nodes.children, { showDelete: false, showIcon: false, expandAll: true, slideUpOthers: false, scrollToView: false});
}

export function AsyncTemplateIDToTreeViewForSearch(templateID: number, callback: (view: TreeView<Info>) => void) {
  RawGetTemplate(templateID).then((data) => {
    callback(CreateTemplateTreeView(data.content));
  });
}

export function TableMiscToUserNode(misc: any, tablePath: string): UserNode<Info> {
  misc._ord = misc._head;
  return TemplateToUserNode(misc, tablePath);
}

export function ArrayMiscToUserNode(misc: any, arrayPath: string): UserNode<Info> {
  const handler = createSearchParserHandler(arrayPath);
  const parser = new Parser<Info, UserNode<Info>>(handler);
  const rootNode = parser.ParseOneField(misc, FieldTypeToString(misc.t), TokenType.ArrayContent, arrayPath);
  return rootNode.children[0];
}

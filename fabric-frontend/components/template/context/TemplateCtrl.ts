import { AnyField, ContainerField, TableField, GeneratorField, ArrayField, Create, PrimitiveField, CompositeField } from "../../../apis/define/Field";
import { FieldType } from '../../../apis/define/FieldType';

export type FieldPath = number[];

type Path = FieldPath;

export class TemplateCtrl {

  private _template: AnyField[];
  private _inform: () => void;

  constructor(template: AnyField[], inform: () => void = null) {
    this._template = template;
    this._inform = inform;
  }

  // public setTemplate(template: AnyField[]) {
  //   this._template = template;
  // }

  // public getTemplate() {
  //   return this._template;
  // }

  // public copy() {
  //   return new TemplateCtrl(this._template, this._inform);
  // }

  public informUpdate() {
    if (this._inform) {
      this._inform();
    }
    else {
      console.warn('No informer.');
    }
  }

  // 删除Path+index表示的字段
  public delete(parent: Path, index: number) {
    if (parent.length === 0) {
      this._template.splice(index, 1);
    }
    else {
      const field = this.fieldAt(parent);
      if (field.type === FieldType.Container) {
        (field as ContainerField).children.splice(index, 1);
      }
      else if (field.type === FieldType.Generator) {
        (field as GeneratorField).children.splice(index, 1);
      }
      else if (field.type === FieldType.Table) {
        (field as TableField).children.splice(index, 1);
      }
      else if (field.type === FieldType.Array) {
        if (index !== 0) throw new Error('Array index error');
        (field as ArrayField).children = [];
      }
      else {
        throw new Error(`Invalid`);
      }
    }
    if (this._inform) this._inform();
  }

  public insert(parent: Path, index: number, type: FieldType) {
    const newField = Create(type);
    if (parent.length === 0) {
      this._template.splice(index, 0, newField);
    }
    else {
      const field = this.fieldAt(parent);
      if (field.type === FieldType.Container) {
        field.children.splice(index, 0, newField);
      }
      else if (field.type === FieldType.Table) {
        if (!FieldType.isPrimitive(type)) {
          throw new Error('Invalid FieldType for TableField');
        }
        (field as TableField).children.splice(index, 0, newField as PrimitiveField);
      }
      else if (field.type === FieldType.Generator) {
        if (type === FieldType.Generator) {
          throw new Error('Invalid FielType for GenrateField');
        }
        (field as GeneratorField).children.splice(index, 0, newField as PrimitiveField);
      }
      else if (field.type === FieldType.Array) {
        if (type === FieldType.Array) throw new Error('Array item type error');
        if (index !== 0) throw new Error('Array item index error');
        (field as ArrayField).children = [newField as PrimitiveField];
      }
    }
    if (this._inform) this._inform();
  }

  public updateOrder(parent: Path, index: number, newIndex: number) {
    let array: AnyField[] = null;
    if (parent.length === 0) {
      array = this._template;
    }
    else {
      array = (this.fieldAt(parent) as CompositeField).children;
    }
    const item = array.splice(index, 1);
    array.splice(newIndex, 0, ...item);
    if (this._inform) this._inform();
  }

  // // 没有用到
  // public updateRequired(parent: Path, index: number, required: boolean) {
  //   if (parent.length === 0) {
  //     this._template[index].required = required;
  //   }
  //   else {
  //     const field = this.fieldAt(parent);
  //     if (field.type === FieldType.Container) {
  //       field.children[index].required = required;
  //     }
  //     else if (field.type === FieldType.Generator) {
  //       field.children[index].required = required;
  //     }
  //     else if (field.type === FieldType.Table) {
  //       field.children[index].required = required;
  //     }
  //     else {
  //       // 数组的“元素”没有required属性
  //       throw new Error('Invalid type in update required');
  //     }
  //   }
  //   if (this._inform) this._inform();
  // }
  // // 没有用到
  // public updateTitle(parent: Path, index: number, title: string) {
  //   if (parent.length === 0) {
  //     this._template[index].title = title;
  //   }
  //   else {
  //     const field = this.fieldAt(parent);
  //     if (field.type === FieldType.Container) {
  //       field.children[index].title = title;
  //     }
  //     else if (field.type === FieldType.Generator) {
  //       field.children[index].title = title;
  //     }
  //     else if (field.type === FieldType.Table) {
  //       field.children[index].title = title;
  //     }
  //     else {
  //       // 数组的“元素”没有title属性
  //       throw new Error('Invalid type in update title');
  //     }
  //   }
  //   if (this._inform) {
  //     console.log('inform');
  //     this._inform();
  //   }
  // }

  // public updateExtra(parent: Path, index: number, extra: FieldExtra) {
  //   let field: AnyField = null;
  //   if (parent.length === 0) {
  //     field = this._template[index];
  //   }
  //   else {
  //     const parentField = this.fieldAt(parent);
  //     if (parentField.type === FieldType.Container) {
  //       field = parentField.children[index];
  //     }
  //     else if (parentField.type === FieldType.Table) {
  //       field = parentField.children[index];
  //     }
  //     else if (parentField.type === FieldType.Generator) {
  //       field = parentField.children[index];
  //     }
  //     else if (parentField.type === FieldType.Array) {
  //       if (index !== 0) throw new Error('Array item index error');
  //       field = parentField.children[0];
  //     }
  //   }
  //   
  //   if (field.type === FieldType.Number) {
  //     field.unit = (extra as NumberFieldExtra).unit;
  //   }
  //   else if (field.type === FieldType.Choice) {
  //     field.choices = (extra as ChoiceFieldExtra).choices;
  //   }
  //   else if (field.type === FieldType.Image) {
  //     field.allowMulti = (extra as ImageFieldExtra).allowMulti;
  //   }
  //   else if (field.type === FieldType.File) {
  //     field.allowMulti = (extra as FileFieldExtra).allowMulti;
  //   }
  //   else if (field.type === FieldType.Range) {
  //     field.subType = (extra as RangeFieldExtra).subType;
  //     field.unit = (extra as RangeFieldExtra).unit;
  //   }
  //   if (this._inform) this._inform();
  // }

  public getChild(parentField: AnyField, index: number) {
    if (parentField.type === FieldType.Container) {
      return (parentField as ContainerField).children[index];
    }
    if (parentField.type === FieldType.Generator) {
      return (parentField as GeneratorField).children[index];
    }
    if (parentField.type === FieldType.Table) {
      return (parentField as TableField).children[index];
    }
    if (parentField.type === FieldType.Array) {
      if (index !== 0) throw new Error('数组的编号必须为0');
      return (parentField as ArrayField).children[0];
    }
    throw new Error("错误的字段");
  }

  public fieldAt(path: Path) {
    if (path.length === 0) throw new Error('Path is empty');
    let current = this._template[path[0]];
    for (let i = 1; i < path.length; ++i) {
      current = this.getChild(current, path[i]);
    }
    return current;
  }
}


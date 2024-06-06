import { Translate as _ } from '../../locale/translate';

export namespace Search {

  export enum MetaType {
    Title = 'title',
    DOI = 'doi',
    Abstract = 'abstract',
    Author = 'realname',
    Keywords = 'keywords',
    Category = 'category_name',
    Text = 'text',
  }

  export enum Operator {
    NotNull = 'any',
    Equal = 'eq',
    NotEqual = 'ne',
    Greater = 'gt',
    GreaterOrEqual = 'gte',
    Less = 'lt',
    LessOrEqual = 'lte',

    StrContain = 'contains',
    StrNotCotain = 'ncontains',
    StrBeginWith = 'startswith',
    StrNotBeginWith = 'nstartswith',
    StrEndWith = 'endswith',
    StrNotEndWith = 'nendswith',

    In = 'in',
    NotIn = 'nin',

    Null = 'none',

    T_All = 'all',
    T_Exist = 'exists',
    T_AllNot = 'nexists',
    T_N = 'index_N',
  }

  export namespace Operator {
    export function toString(op: Operator): string {
      switch (op) {
        case Operator.NotNull: return _('is not null');
        case Operator.Equal: return _('equals');
        case Operator.NotEqual: return _('not equals');
        case Operator.Greater: return _('greater than');
        case Operator.GreaterOrEqual: return _('greater than or equal');
        case Operator.Less: return _('less than');
        case Operator.LessOrEqual: return _('less than or equals');
        case Operator.StrContain: return _('contains string');
        case Operator.StrNotCotain: return _('not contains string');
        case Operator.StrBeginWith: return _('begins with string');
        case Operator.StrNotBeginWith: return _('not begins with string');
        case Operator.StrEndWith: return _('ends with string');
        case Operator.StrNotEndWith: return _('not ends with string');
        case Operator.In: return _('in');
        case Operator.NotIn: return _('not in');
        case Operator.Null: return _('is null');
        case Operator.T_All: return _('all satisfy');
        case Operator.T_Exist: return _('exists one that satisfies');
        case Operator.T_AllNot: return _('exists none that satisfies');
        case Operator.T_N: return _('n-th one satisfies');
        default: throw 'Invalid search operator';
      }
    }
  }


  export namespace Condition {
    export interface Or {
      or: Any[];
    }

    export interface And {
      and: Any[];
    }

    export interface Field {
      field: string;
      op: Search.Operator;
      val: string | number | Any;
    }

    export type Any = Or | And | Field;
  }

}

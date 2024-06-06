import { FieldPath } from '../../context/TemplateCtrl';
import { AnyField, BaseField } from '../../../../apis/define/Field';

export interface ContentProps<T extends BaseField> {
    // 父容器的路径
    parent: FieldPath;
    // 在父容器中的序号
    index: number;
    // 完整路径
    path: FieldPath;
    
    // 字段对象
    field: T;

    // 提示更新函数
    informUpdate: () => void;

    onLoad?: (location:number[]) => void;
}

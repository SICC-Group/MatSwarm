export interface InputFieldProps<T> {
    // 父元素
    parent: any;
    // 值在父亲元素的位置
    name: string;
    // 提醒父组件更新内容
    informUpdate: () => void;
    // 字段信息，例如对于Number，则field表示这个输入框对应的字段
    // 从这里可以拿到NumberField的unit
    field: T;
}

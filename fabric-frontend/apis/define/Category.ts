export interface Category extends Category.Base {
    children: Category[];
}

export namespace Category {
    export interface Base {
        id: number;
        name: string;
    }

    export interface Raw extends Base {
        level: number;
        pid?: number;
        leaf: boolean;
        order?: number;
        // 从API获取的都没有children字段
        // 必须手动加上
        children?: Raw[];
    }
    
}

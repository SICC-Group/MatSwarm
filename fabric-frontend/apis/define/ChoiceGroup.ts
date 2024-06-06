export interface ChoiceGroupItem {
    name: string;
    items: ChoiceItem[];
}

export type ChoiceItem = string | ChoiceGroupItem;

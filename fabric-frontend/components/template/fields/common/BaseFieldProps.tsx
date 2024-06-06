import { BaseField } from '../../../../apis/define/Field';
import { ContentProps } from '../content/ContentProps';

export interface BaseFieldProps<T extends BaseField> extends ContentProps<T> {
    isFirst: boolean;
    isLast: boolean;
    isIdentifier?: boolean;
}

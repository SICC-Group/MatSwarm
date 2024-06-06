import React from 'react';
import { FieldType } from '../../../../apis/define/FieldType';
import { StringContentView, String } from './String';
import { ImageContentView, Image } from './Image';
import { FileContentView, File } from './File';
import { NumberContentView, Number } from './Number';
import { GeneratorContentView , Generator,GeneratorContentEdit} from './Generator';
import { TableContentView, Table,TableContentEdit } from './Table';
import { ContainerContentView, Container,ContainerContentEdit } from './Container';
import { AnyField } from '../../../../apis/define/Field';
import { ContentProps } from './ContentProps';
import { ArrayContentView, Array,ArrayContentEdit } from './Array';
import { ChoiceContentView, Choice } from './Choice';
import { RangeContentView, Range } from './Range';

export function FieldTypeToContentView(type: FieldType): React.ComponentType<ContentProps<AnyField>> {
    switch(type) {
        case FieldType.String: return StringContentView as any;
        case FieldType.Image: return ImageContentView as any;
        case FieldType.File: return FileContentView as any;
        case FieldType.Number: return NumberContentView as any;
        case FieldType.Generator: return GeneratorContentView as any;
        case FieldType.Table: return TableContentView as any;
        case FieldType.Container: return ContainerContentView as any;
        case FieldType.Array: return ArrayContentView as any;
        case FieldType.Choice: return ChoiceContentView as any;
        case FieldType.Range: return RangeContentView as any;
        default: throw new Error('No impelement');
    }
}

export function FieldContent(type: FieldType): React.ComponentType<ContentProps<AnyField>> {
    switch(type) {
        case FieldType.String: return String as any;
        case FieldType.Image: return Image as any;
        case FieldType.File: return File as any;
        case FieldType.Number: return Number as any;
        case FieldType.Generator: return Generator as any;
        case FieldType.Table: return Table as any;
        case FieldType.Container: return Container as any;
        case FieldType.Array: return Array as any;
        case FieldType.Choice: return Choice as any;
        case FieldType.Range: return Range as any;
        default: throw new Error('No impelement');
    }
}

export function FieldTypeToContentViewEdit(type: FieldType): React.ComponentType<ContentProps<AnyField>> {
    switch(type) {
        case FieldType.String: return StringContentView as any;
        case FieldType.Image: return ImageContentView as any;
        case FieldType.File: return FileContentView as any;
        case FieldType.Number: return NumberContentView as any;
        case FieldType.Generator: return GeneratorContentEdit as any;
        case FieldType.Table: return TableContentEdit as any;
        case FieldType.Container: return ContainerContentEdit as any;
        case FieldType.Array: return ArrayContentEdit as any;
        case FieldType.Choice: return ChoiceContentView as any;
        case FieldType.Range: return RangeContentView as any;
        default: throw new Error('No impelement');
    }
}
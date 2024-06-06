import React, { FC, useState } from 'react';

import { FilterSelect, ContentItem } from './FilterSelect';
import { Button, Tag } from 'antd';
import { Summary } from '../../apis/search/v2/Query';
import { Search } from '../../apis/define/search';
import { FormattedMessage } from 'react-intl';

interface Props {
    summary: Summary;
    updateCondition: (cond: Search.Condition.And) => void;
}

interface FilterConfig {
    title: React.ReactNode;
    key: string;
    hasSummary: boolean;
    allowInput: boolean;
}

const filterTypes: FilterConfig[] = [
    { title: <FormattedMessage id='category' defaultMessage='分类'></FormattedMessage>, key: 'category', hasSummary: true, allowInput: false },
    { title: <FormattedMessage id='realname' defaultMessage='上传人'></FormattedMessage>, key: 'realname', hasSummary: true, allowInput: false },
    { title: <FormattedMessage id='keywords' defaultMessage='标签'></FormattedMessage>, key: 'keywords', hasSummary: true , allowInput: false },
]

type FilterType = ContentItem & { value: any, displayName: React.ReactNode }

function FiltersToCondition(filters: FilterType[]): Search.Condition.And {
    return { and: filters.map<Search.Condition.Field>(v => ({ field: v.key as string, val: v.value, op: Search.Operator.Equal })) };
}

export const FilterView: FC<Props> = (props) => {

    const [filters, setFilters] = useState<FilterType[]>([]);

    const handleClear = () => {
        setFilters([]);
        props.updateCondition(FiltersToCondition([]));
    }

    const handleAddFilter = (key: string, title: React.ReactNode, value: any, displayName: React.ReactNode) => {
        let result: FilterType[] = [];
        for (let i = 0; i < filters.length; ++i) {
            if (filters[i].key !== key) result.push(filters[i]);
        }
        result.push({ key, value, title, displayName });
        setFilters(result);
        props.updateCondition(FiltersToCondition(result));
    }

    const handleRemoveFilter = (key: string) => {
        let result: FilterType[] = [];
        for (let i = 0; i < filters.length; ++i) {
            if (filters[i].key !== key) result.push(filters[i]);
        }
        setFilters(result);
        props.updateCondition(FiltersToCondition(result));
    }

    return (
        <div style={{margin: '12px 0', padding: '0 12px', flexGrow: 0, backgroundColor: '#FFF'}}>
            <div style={{borderBottom: '1px solid #E9E9E9'}}>
                <FormattedMessage id='Filter criteria' defaultMessage='筛选条件' />：
                {filterTypes.map((value) => {

                    let items: ContentItem[] = [];
                    if (value.key === 'category') {
                        items = props.summary.category.map(v => ({ title: v.name, key: v.id, }))
                    }
                    else if (value.key === 'realname') {
                        if (props.summary.realname) {
                           items = props.summary.realname.map(v => ({ title: v.key, key: v.key}))
                        }
                    }
                    else if (value.key === 'keywords') {
                        if (props.summary.keywords) {
                            items = props.summary.keywords.map(v => ({ title: v.key, key: v.key}))
                        }
                    }
                    return (
                    <FilterSelect key={value.key} content={items} onAdd={(newValue, dName) => handleAddFilter(value.key, value.title, newValue, dName)}
                        title={value.title} 
                        allowInput={value.allowInput} />
                    );
                }
                )}
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{flexGrow: 1}}>
                    {filters.map((value) => {
                        return (
                            <Tag closable key={value.key} onClose={() => handleRemoveFilter(value.key as any)}>
                                {value.title}:{value.displayName}
                            </Tag>
                        )
                    })}
                </div>
                <div style={{flexGrow: 0, padding: '8px 0'}}>
                    <Button onClick={handleClear} size='small'><FormattedMessage id='clear' defaultMessage='清空' /></Button>
                </div>
            </div>
        </div>
    )
}

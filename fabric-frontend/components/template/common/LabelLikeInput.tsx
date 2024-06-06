import React, { FC ,useState} from 'react';
import withStyles, { WithStyles } from 'react-jss';
import {AutoComplete} from 'antd'
import {ThesaurusSearch,GetThesaurusSearchResult} from '../../../apis/template/Thesaurus'
import Cookie from 'js-cookie'
const styles = {
    Input: {
        border: '1px solid #D9D9D9',
        textOverflow: 'ellipsis',
        outline: 'none',
        width: '240px',
        fontSize: '18px',
        borderRadius: '4px',
    },
    Label: {
        fontSize: '18px',
        width: '240px',
        padding: '4px 2px 1px 2px',
        lineHeight: '26px',
    }, 
    EmptyLabel: {
        fontSize: '18px',
        color: '#777',
        width: '240px',
        padding: '4px 2px 1px 2px',
        lineHeight: '26px',
    }
}

export interface LabelLikeInputProps extends WithStyles<typeof styles> {
    className?: string;
    style?: React.CSSProperties;

    editMode?: boolean;

    label: React.ReactNode;

    value: string;

    placeholder: string;

    onChange: (newValue: string) => void; 
}



const LabelLikeInput: FC<LabelLikeInputProps> = (props) => {
    const [options, setOptions] = useState<GetThesaurusSearchResult[]>([]);
    const onSearch = (searchText: string) => {
        return (searchText&&Cookie.get('categoryID'))?
        ThesaurusSearch(Number(Cookie.get('categoryID')),searchText,5).then((value)=>{
          setOptions(value);
        }):setOptions([])
      };
    const getoption = ()=>{
        let children:any = [];
        options.map((value,index)=>{
          children.push(value.term)
        })
        return(children);
    }
    const onSelect = (data:any) => {
        props.onChange(data)
    };
    const onChange = (data: string) => {
        props.onChange(data);
      };
    if (props.editMode) {
        return (
            // <input value={props.value}
            //     style={props.style}
            //     className={`${props.classes.Input} ${props.className || ''}`}   
            //     onChange={handleOnChange} placeholder={props.placeholder} />
            <>
            <AutoComplete
                style={{ width: 300 }}
                dataSource={getoption()}
                value={props.value}
                onSelect={onSelect}
                onSearch={onSearch}
                onChange={onChange}
                placeholder={props.placeholder}
                defaultActiveFirstOption={false}
            >
            </AutoComplete>
            </>
        );
    }
    else {
        const empty = (props.value === '');

        return (
            <span 
                style={props.style} 
                className={`${empty ? props.classes.EmptyLabel : props.classes.Label} ${props.className || ''}`}>
                {empty ? props.placeholder : props.label}
            </span>
        )
    }
}

export default withStyles(styles)(LabelLikeInput);

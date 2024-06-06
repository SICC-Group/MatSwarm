import React, { FC, useState } from 'react';
import { Button } from 'antd';

import { ContentProps } from './ContentProps';
import { ChoiceField } from '../../../../apis/define/Field';
import LabelLikeInput from '../../common/LabelLikeInput';
import { ChoiceGroupItem } from '../../../../apis/define/ChoiceGroup';

import './Choice.less';
import { FormattedMessage } from 'react-intl';

interface ChoiceItemViewProps {
  name: string;
  onChange: (newValue: string) => void;
  onDelete: () => void;
  onAppend: () => void;
}

const ChoiceItemView: FC<ChoiceItemViewProps> = ({ name, onChange, onDelete, onAppend }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{margin: '4px 0', display: 'flex', flexDirection: 'row'}} 
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <i className='material-icons ChoiceItemButton' onClick={onDelete}>clear</i>
      {/* <i className="material-icons ChoiceItemButton" onClick={onAppend}>add</i> */}
      <LabelLikeInput editMode={hover} label={name} placeholder='选项名称' value={name} onChange={onChange} />
      
    </div>
  )
}

interface ChoiceGroupViewProps {
  group: ChoiceGroupItem;
  informUpdate: () => void;
  onChange: (newValue: string) => void;
  onDelete: () => void;
  onAppend: () => void;
}

const ChoiceGroupView: FC<ChoiceGroupViewProps> = (props) => {
  const { group, onChange, onDelete, informUpdate }  = props;
  const [hover, setHover] = useState(false);

  const handleNewItem = () => {
    group.items.push('');
    informUpdate();
  }

  const handleItemNameChange = (newName: string, index: number) => {
    group.items[index] = newName;
    informUpdate();
  }
  const handleItemDelete = (index: number) => {
    group.items.splice(index, 1);
    informUpdate();
  }
  const handleItemAppend = (index: number) => {
    group.items.splice(index + 1, 0, '');
    informUpdate();
  }

  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      
      <i className='material-icons ChoiceItemButton' onClick={onDelete}>clear</i>
      <LabelLikeInput editMode={hover} label={group.name} placeholder='选项名称' value={group.name} onChange={onChange} />
      <ul>
        {
          group.items.map((value, index, array) => {
            return (
              <li>
                <ChoiceItemView key={index} name={value as string} 
                  onDelete={() => handleItemDelete(index)}
                  onAppend={() => handleItemAppend(index)}
                  onChange={(newValue) => handleItemNameChange(newValue, index)}/>
              </li>
            )
          })
        }
      </ul>
      <Button size='small' onClick={handleNewItem}>
        <FormattedMessage id='template:add_new_choice' defaultMessage='增加新选项'/>
      </Button>
    </div>
  )
}

export const ChoiceContentView: FC<ContentProps<ChoiceField>> = (props) => {

  const { field, informUpdate } = props;
  const choices = field.choices;

  const handleNewItem = () => {
    choices.push('');
    informUpdate();
  }

  const handleNewGroup = () => {
    choices.push({ name: '', items: []})
    informUpdate();
  }

  const handleItemNameChange = (newName: string, index: number) => {
    choices[index] = newName;
    informUpdate();
  }
  const handleItemDelete = (index: number) => {
    choices.splice(index, 1);
    informUpdate();
  }
  const handleItemAppend = (index: number) => {
    choices.splice(index + 1, 0, '');
    informUpdate();
  }

  const handleGroupNameChange = (newName: string, index: number) => {
    (choices[index] as ChoiceGroupItem).name = newName;
    informUpdate();
  }

  return (
    <div>
      <div>
        <i style={{fontSize: '16px', lineHeight: '16px'}} className="material-icons">info</i>
        <FormattedMessage id='template:choice_name_no_repeat' defaultMessage='选项名字不能重复' />
      </div>
      <ul>
        {
          choices.map((value, index, array) => {
            if (Object.keys(value).includes('name')) {
              // is a group
              return (
                <li>
                  <ChoiceGroupView key={index} 
                    onChange={(t) => handleGroupNameChange(t, index)}
                    onDelete={() => handleItemDelete(index)}
                    onAppend={() => handleItemAppend(index)}
                    informUpdate={informUpdate}
                    group={value as ChoiceGroupItem}/>
                </li>
              );
            }
            else {
              // a string choice
              return (
                <li>
                  <ChoiceItemView key={index} name={value as string} 
                    onDelete={() => handleItemDelete(index)}
                    onAppend={() => handleItemAppend(index)}
                    onChange={(newValue) => handleItemNameChange(newValue, index)}/>
                </li>
              )
            }
          })
        }
      </ul>
      <div>
        <Button.Group size='small'>
          <Button onClick={handleNewItem}>
            <FormattedMessage id='template:add_new_choice' defaultMessage='增加新选项'/>
          </Button>
          <Button onClick={handleNewGroup}>
            <FormattedMessage id='template:add_new_choice_group' defaultMessage='增加新选项组'/>
          </Button>
        </Button.Group>
      </div>
    </div>
  )
}


interface ChoiceItemProps {
  name: string;
}

const ChoiceItem: FC<ChoiceItemProps> = ({ name }) => {
  return (
    <div style={{margin: '4px 0', display: 'flex', flexDirection: 'row'}} >
      {/* <i className="material-icons ChoiceItemButton" onClick={onAppend}>add</i> */}
      <LabelLikeInput editMode={false} label={name} placeholder='选项名称' value={name} onChange={null} />
      
    </div>
  )
}

interface ChoiceGroupProps {
  group: ChoiceGroupItem;
}

const ChoiceGroup: FC<ChoiceGroupProps> = (props) => {
  const { group }  = props;

  return (
    <div>
      
      <LabelLikeInput editMode={false} label={group.name} placeholder='选项名称' value={group.name} onChange={null} />
      <ul>
        {
          group.items.map((value, index, array) => {
            return (
              <li>
                <ChoiceItem key={index} name={value as string} />
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export const Choice: FC<ContentProps<ChoiceField>> = (props) => {

  const { field, informUpdate } = props;
  const choices = field.choices;

  return (
    <div>
      <ul>
        {
          choices.map((value, index, array) => {
            if (Object.keys(value).includes('name')) {
              // is a group
              return (
                <li>
                  <ChoiceGroup key={index} group={value as ChoiceGroupItem}/>
                </li>
              );
            }
            else {
              // a string choice
              return (
                <li>
                  <ChoiceItem key={index} name={value as string} />
                </li>
              )
            }
          })
        }
      </ul>
    </div>
  )
}

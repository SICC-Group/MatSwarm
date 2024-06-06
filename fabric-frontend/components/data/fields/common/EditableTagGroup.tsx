import React from 'react';
import { Tag, Input, Tooltip, Icon } from 'antd';
import { autobind } from 'core-decorators';
import { FormattedMessage } from 'react-intl';

export interface EditableTagGroupProps {
  tags: string[];
  onTagsChange: (newTags: string[]) => void;

  size?: 'small' | 'default' |'large';
}

interface State {
  inputVisible: boolean;
  inputValue: string;
}

export class EditableTagGroup extends React.Component<EditableTagGroupProps, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      inputValue: '',
      inputVisible: false,
    }
  }

  @autobind
  handleClose(removedTag: string) {
    const newTags = this.props.tags.filter(tag => tag !== removedTag);
    this.props.onTagsChange(newTags);
  }

  @autobind
  showInput() {
    this.setState({
      inputVisible: true,
    }, () => (this.input as any).focus()
    );
  }

  @autobind
  handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let tags = [...this.props.tags];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      // inputVisible: false,
      inputValue: '',
    });
    this.props.onTagsChange(tags);
  };

  handleBlur = () => {
    const { inputValue } = this.state;
    let tags = [...this.props.tags];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
    this.props.onTagsChange(tags);
  };


  input: React.LegacyRef<Input>;
  saveInputRef = (input: any) => (this.input = input);

  render() {
    const { inputVisible, inputValue } = this.state;
    return (
      <div>
        {this.props.tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable={true} onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
              tagElem
            );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size={this.props.size}
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleBlur}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" />
            <FormattedMessage id='data:new_tag' defaultMessage='新标签'/>
          </Tag>
        )}
      </div>
    );
  }
}

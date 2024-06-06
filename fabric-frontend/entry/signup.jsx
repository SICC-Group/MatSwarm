
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Button, Checkbox } from 'antd';

import { gettext as _ } from 'django';

import Urls from '../apis/Urls';
// import { Checkbox } from '../components/Checkbox';
import { GlobalInit } from "../utils/global";

// const logo2 = require('../img/logo2.png');
// const logo2 = require('../img/logo18.png');
const logo2 = require('../img/logo_MatSwarm.png');

// 两个页面共用一套样式表
import './login.scss';

GlobalInit();

class SignupApp extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
      realName: '',
      org: '',
      agreeTermsOfUse: false,

      showError: false,
      errorText: '',
      requesting: false
    };


    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmChange = this.handleConfirmChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleRealNameChange = this.handleRealNameChange.bind(this);
    this.handleOrgChange = this.handleOrgChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  render() {
    return (
      <div className="flex-center full-vh">
        <div className="flex-center card-wrapper">
          <div className="card">
            <a href={Urls.site_index}><img className="logo" src={logo2} style={{width:'200px', height:'auto'}}/></a>
            <ul><li className="active">{_('Signup')}</li></ul>
            <div className="login-form" style={{minWidth: '320px'}}>
              <p className={this.state.showError ? 'error-info show' : 'error-info'} >
                {this.state.errorText}
              </p>
              <input type="text" value={this.state.username}
                onChange={this.handleUsernameChange} 
                placeholder={_('Username')} />
              <input type="password" value={this.state.password}
                onChange={this.handlePasswordChange} 
                placeholder={_('Password')} />
              <input type="password" value={this.state.passwordConfirm}
                onChange={this.handleConfirmChange} 
                placeholder={_('Confirm password')} />
              <input type="text" value={this.state.email}
                onChange={this.handleEmailChange} 
                placeholder={_('Email Address')} />
              <input type="text" value={this.state.realName}
                onChange={this.handleRealNameChange} 
                placeholder={_('Real Name')} />
              <input type="text" value={this.state.org}
                onChange={this.handleOrgChange} 
                placeholder={_('Institution')} />
            </div>
            <div>
              <div className="remember-wrapper">
                
                <Checkbox
                  onChange={this.handleCheckboxChange} 
                  checked={this.state.agreeTermsOfUse}>
                  {_('I have read and agree to the Terms of Use')} 
                  </Checkbox>
              </div>
            </div>
            <Button disabled={!this.state.agreeTermsOfUse} 
              type='primary' size='large'
              loading={this.state.requesting} onClick={this.handleButtonClick}>
              {_('Signup')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  handleCheckboxChange(event) { this.setState({ agreeTermsOfUse: event.target.checked });}
  handleUsernameChange(event) { this.setState({ username: event.target.value }); }
  handlePasswordChange(event) { this.setState({ password: event.target.value }); }
  handleConfirmChange(event) { this.setState({ passwordConfirm: event.target.value }); }
  handleEmailChange(event) { this.setState({ email: event.target.value }); }
  handleRealNameChange(event) { this.setState({ realName: event.target.value }); }
  handleOrgChange(event) { this.setState({ org: event.target.value }); }

  checkForm() {
    if (this.state.username.length === 0) return { result: true, text: _('Username cannot be empty') }
    if (this.state.password.length === 0) return { result: true, text: _('Password cannot be empty') }
    if (this.state.passwordConfirm !== this.state.password) return { result: true, text: _('Confirm password not match')}
    if (this.state.email.length === 0) return {result: true, text: _('Email address cannnot be empty') }
    if (this.state.realName.length === 0) return { result: true, text: _('Real name is required') }
    if (this.state.org.length === 0) return { result: true, text: _('Institution is required') }

    return {result: false};
  }

  handleButtonClick() {
    const ret = this.checkForm();
    if (!ret.result) {
      this.setState({
        requesting: true
      });
      fetch(Urls.api_v1_account.user_list, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          email: this.state.email,
          real_name: this.state.realName,
          institution: this.state.org
        })
      }).then((res) => {
        if (res.ok) {
          window.location.href = '/account/login_mge/';
          // window.location.href = Urls.account.login;
          // window.location.href = Urls.account.login_18;
        }
        else {
          res.json().then((data) => {
            this.setState({
              requesting: false,
              showError: true,
              errorText: data.msg
            })
          })
        }
      }).catch((reason) => {
        console.log({reason});
        this.setState({
          requesting: false,
          showError: true,
          errorText: _('Please try again later or contact admin.')
        });
      })
    }
    else {
      this.setState({
        showError: true,
        errorText: ret.text
      });
    }
  }
}

ReactDOM.render(<SignupApp />, document.getElementById('wrap'));



import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Checkbox } from 'antd';

import { autobind } from 'core-decorators';
import { gettext as _ } from 'django';

import { GenerateCaptchaUrl } from '../apis/session/GenerateCaptchaURL';
import Urls from '../apis/Urls';
// const logo2 = require('../img/logo2.png');
const logo2 = require('../img/logo_MatSwarm.png');
// const logo2 = require('../img/logo18.png');
// import { Checkbox } from '../components/Checkbox';
import { GlobalInit } from '../utils/global';
import { LangSwitch } from "../components/layout/LangSwitch";

import './login.scss';

GlobalInit();

function GetURLParam(name: string): string | null {
  const url = window.location;
  const regex = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const matchArray = url.search.substr(1).match(regex);
  if (matchArray !== null) {
    // 不确定是否有必要unesacpe
    return unescape(matchArray[2]);
  }
  else {
    return null;
  }
}

class LoginApp extends React.Component<any, any> {

  constructor(props: any) {
    super(props);

    this.state = {
      rememberMe: false,
      showError: false,
      errorText: '',
      username: '',
      password: '',
      captcha: '',
      requesting: false,
      captchaUrl: GenerateCaptchaUrl(),
    };
  }

  render() {
    return (
      <div className='flex-center full-vh'>
        <div className='flex-center card-wrapper'>
          <div className='card'>
            <a href={Urls.site_index}><img className='logo' src={logo2} style={{ width: '200px', height: 'auto' }} /></a>
            <ul>
              {/*<li className='active'>{_('Login')}</li>*/}
              <li className='active'>Login</li>
            </ul>
            <div className='login-form'>
              <p className={this.state.showError ? 'error-info show' : 'error-info'} >
                {this.state.errorText}
              </p>
              <input type='text' value={this.state.username}
                onChange={this.onUsernameChange}
                // placeholder={_('Username or email')} />
                placeholder={'Username or email'} />
              <input type='password' value={this.state.password} onChange={this.onPasswordChange}
                // placeholder={_('Password')} />
                placeholder={'Password'} />
            </div>
            <div>
              <div className='remember-wrapper'>
                <Checkbox
                  onChange={this.handleCheckboxChange}
                  // checked={this.state.rememberMe}>{_('Remember me')}</Checkbox>
                  checked={this.state.rememberMe}>{'Remember me'}</Checkbox>
              </div>
              <div className='register-wrapper'>
                <ul>
                  {/*<li><a href={Urls.account.reset_request}>{_('Forgot your password?')}</a></li>*/}
                  <li><a href={Urls.account.reset_request}>{'Forgot your password?'}</a></li>
                  {/*<li><a href={Urls.account.register}>{_('Signup')}</a></li>*/}
                  <li><a href={Urls.account.register}>{'Signup'}</a></li>
                </ul>
              </div>
            </div>
            <Button loading={this.state.requesting} type='primary' size='large' href='javascript:void(0)' onClick={this.onButtonClick}>
              {/*{_('Login')}*/}
              {'Login'}
            </Button>
            <Button loading={this.state.requesting} type='primary' size='large' href='javascript:void(0)' onClick={this.onsignButtonClick}>
              {/*{_('Login')}*/}
              {'signup'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  public onButtonClick(): void {
    if (this.state.username.length === 0) {
      this.setState({
        showError: true,
        errorText: _('Username cannot be empty'),
      });
      return;
    }
    else if (this.state.password.length === 0) {
      this.setState({
        showError: true,
        errorText: _('Password cannot be empty'),
      });
      return;
    }

    this.setState({
      requesting: true,
      showError: false,
    });

    fetch('http://localhost:9001/api/v1/account/user/session/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    }).then((res) => {

      if (res.ok) {
        const next = GetURLParam('next');
        // 防止开放重定向攻击
        if (next && next.startsWith('/')) {
          window.location.href = next;
        }
        else {
          window.location.href = Urls.site_index;
        }
        return;
      }
      else { // 不OK的情况下是数据内容的错误
        res.json().then((data) => {
          this.setState({
            requesting: false,
            showError: true,
            errorText: data.msg,
            captchaUrl: GenerateCaptchaUrl(),
          });
        });
      }
    }).catch((reason) => {
      // 这里是网络错误
      this.setState({
        requesting: false,
        showError: true,
        errorText: _('Please try again later or contact admin.'),
        captchaUrl: GenerateCaptchaUrl(),
      });
    });
  }


  @autobind
  public onsignButtonClick(): void {
    if (this.state.username.length === 0) {
      this.setState({
        showError: true,
        errorText: _('Username cannot be empty'),
      });
      return;
    }
    else if (this.state.password.length === 0) {
      this.setState({
        showError: true,
        errorText: _('Password cannot be empty'),
      });
      return;
    }

    this.setState({
      requesting: true,
      showError: false,
    });

    fetch('http://localhost:8000/api/v1/account/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        realname: this.state.username,
        email: `${this.state.username}@example.com`,
        role: 2,
      }),
    }).then((res) => {

      if (res.ok) {
        const next = GetURLParam('next');
        // 防止开放重定向攻击
        if (next && next.startsWith('/')) {
          // window.location.href = next;
        }
        else {
          // window.location.href = Urls.site_index;
        }
        return;
      }
      else { // 不OK的情况下是数据内容的错误
        res.json().then((data) => {
          this.setState({
            requesting: false,
            showError: true,
            errorText: data.msg,
            captchaUrl: GenerateCaptchaUrl(),
          });
        });
      }
    }).catch((reason) => {
      // 这里是网络错误
      this.setState({
        requesting: false,
        showError: true,
        errorText: _('Please try again later or contact admin.'),
        captchaUrl: GenerateCaptchaUrl(),
      });
    });
  }

  @autobind
  public handleCheckboxChange(event: any): void {
    this.setState({
      rememberMe: event.target.checked,
    });
  }

  @autobind
  public onUsernameChange(event: any): void {
    this.setState({
      username: event.target.value,
    });
  }

  @autobind
  public onPasswordChange(event: any): void {
    this.setState({
      password: event.target.value,
    });
  }

  @autobind
  public onCaptchaChagne(event: any): void {
    this.setState({
      captcha: event.target.value,
    });
  }

  @autobind
  public onCaptchaImageClick(event: any): void {
    this.setState({
      captchaUrl: GenerateCaptchaUrl(),
    });
  }
}

ReactDOM.render(<LoginApp />, document.getElementById('wrap'));

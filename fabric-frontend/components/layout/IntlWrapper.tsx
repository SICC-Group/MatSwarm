import React, { Component } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

import { autobind } from 'core-decorators';
import Cookie from 'js-cookie';

import { LocaleContext } from '../../locale/Context';
import { Locale, MessagesLoader } from '../../locale/define';
import { GetDefaultLanguage } from '../../locale/GetDefaultLanguage';

addLocaleData([...en, ...zh]);

const { Provider } = LocaleContext;

export interface IntlWrapperProps {
    reloadOnSwitch?: boolean;
}

interface IntlWrapperState {
    locale: Locale;
    messages: any;
}

export class IntlWrapper extends Component<IntlWrapperProps, IntlWrapperState> {

    constructor(props: any) {
        super(props);
        const locale = GetDefaultLanguage();
        this.state = {
            locale,
            messages: MessagesLoader(locale),
        };
    }

    // componentWillMount() {
    //     MessagesLoader(this.state.locale).then((messages) => {
    //         this.setState({ messages });
    //     });
    // }

    render() {
        return (
            <Provider value={{ locale: this.state.locale, switchTo: this.switchTo }}>
                <IntlProvider
                    locale={this.state.locale}
                    defaultLocale='zh-Hans'
                    messages={this.state.messages}>
                    {this.props.children}
                </IntlProvider>
            </Provider>
        );
    }

    @autobind
    switchTo(locale: Locale) {
        if (locale !== this.state.locale) {
            Cookie.set('django_language', locale);
            if (this.props.reloadOnSwitch) {
                window.location.reload();
                return;
            }

            // const hide = message.loading('Loading...', 0);
            // MessagesLoader(locale).then((messages) => {
            //     this.setState({ locale, messages });
            //     hide();
            // });
            this.setState({locale, messages: MessagesLoader(locale)});
        }
    }
}

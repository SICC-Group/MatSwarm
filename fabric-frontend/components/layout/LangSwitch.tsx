import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Tooltip } from 'antd';

import { LocaleContext, LocaleContextType } from '../../locale/Context';
import { Locale } from '../../locale/define';

import withStyles, { WithStyles } from 'react-jss';

import enIcon from '../../img/en-US.png';
import zhIcon from '../../img/zh-Hans.png';

const styles = {
	langSwitch: {
		cursor: 'pointer',
		width: '48px',
		padding: '24px 14px',
		'&:hover': {
			background: '#F29220',
		}
	}
}

export interface LangSwitchProps extends WithStyles<typeof styles> {
	className?: string;
}

const _LangSwtich: FC<LangSwitchProps> = ({ classes }) => {
	return (
		<LocaleContext.Consumer>
			{
				(value: LocaleContextType) => {

					const icon = (value.locale === Locale.en_US ? zhIcon : enIcon);
					function switchHandler() {
						if (value.locale === Locale.en_US) {
							value.switchTo(Locale.zh_Hans);
						}
						else {
							value.switchTo(Locale.en_US);
						}
					}

					return (
						<Tooltip title={<FormattedMessage id='header:switch_lang' defaultMessage='切换语言' />}>
							<img className={classes.langSwitch} onClick={switchHandler} src={icon} />
						</Tooltip>

					);
				}
			}
		</LocaleContext.Consumer>
	);
}

export const LangSwitch = withStyles(styles)(_LangSwtich);

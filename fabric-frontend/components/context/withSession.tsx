import React, { ComponentType, Component } from 'react';
import { SessionContext, SessionContextType } from './session';

export interface WithSession {
  session: SessionContextType;
}

export const withSession = <P extends WithSession>(Cmp: ComponentType<P & WithSession>) => {
  type Props = Omit<P, keyof WithSession>;
  return class extends Component<Props> {
    render() {
      return (
        <SessionContext.Consumer>
          {
            (value) => {
              return (<Cmp {...this.props as P} session={value}/>)
            }
          }
        </SessionContext.Consumer>
      )
    }
  }
}

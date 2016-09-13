import * as React from 'react';
import { css } from 'office-ui-fabric-react';
import spSecurityService from "../spsecurityService";
import {SPSecurityInfo}from "../spsecurityService";

import styles from '../SpSecurityWebpart.module.scss';
import { ISpSecurityWebpartWebPartProps } from '../ISpSecurityWebpartWebPartProps';

export interface ISpSecurityWebpartProps extends ISpSecurityWebpartWebPartProps {
}

export default class SpSecurityWebpart extends React.Component<ISpSecurityWebpartProps, {}> {
  private svc: spSecurityService = new spSecurityService("ss");
  public componentWillMount(): void {
    debugger;
    this.svc.loadData(false).then((response) => {
      debugger;
      this.setState(response);
    });

  }
  public constructor(props) {
    super(props);
    debugger;
    this.state= new SPSecurityInfo();

  }

  public render(): JSX.Element {
    debugger;
    return (
      <div className={styles.spSecurityWebpart}>
        <div className={styles.container}>
          <div className={css('ms-Grid-row ms-bgColor-themeDark ms-fontColor-white', styles.row) }>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
              <span className='ms-font-xl ms-fontColor-white'>
                Welcome to SharePoint!
              </span>
              <p className='ms-font-l ms-fontColor-white'>
                siteuserds {this.props.users.length}

              </p>
              <p className='ms-font-l ms-fontColor-white'>
                Customize SharePoint experiences using Web Parts.
              </p>
              <p className='ms-font-l ms-fontColor-white'>
                {this.props.description}
              </p>
              <a
                className={css('ms-Button', styles.button) }
                href='https://github.com/SharePoint/sp-dev-docs/wiki'
                >
                <span className='ms-Button-label'>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

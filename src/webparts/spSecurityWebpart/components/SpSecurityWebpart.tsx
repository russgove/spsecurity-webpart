import * as React from "react";
import { css } from "office-ui-fabric-react";
import spSecurityService from "../spsecurityService";
import {SPSecurityInfo}from "../spsecurityService";
import SPSecurityWebpartTableRow from "./SPSecurityWebpartTableRow";
import styles from "../SpSecurityWebpart.module.scss";
import { ISpSecurityWebpartWebPartProps } from "../ISpSecurityWebpartWebPartProps";

export interface ISpSecurityWebpartProps extends ISpSecurityWebpartWebPartProps {
}

export default class SpSecurityWebpart extends React.Component<ISpSecurityWebpartProps, SPSecurityInfo> {
  private svc: spSecurityService = new spSecurityService("ss");
  public componentWillMount(): void {
    debugger;
    this.svc.loadData(false).then((response) => {

      this.setState(response as SPSecurityInfo );
    });

  }
  public constructor(props) {
    super(props);

    this.state = new SPSecurityInfo();

  }
//  public  SPSecurityWebpartTableRow(props): JSX.Element {
//     debugger;
//    return (
//      <tr>key={props.list.id}><td>{props.list.title}</td><td>{props.list.id}</td></tr>
//    );
//  }



  public render(): JSX.Element {
    debugger;

    let state: any = this.state;
    return (
      <div className={styles.spSecurityWebpart}>
        <div className={styles.container}>

          <div className={css("ms-Grid-row ms-bgColor-themeDark ms-fontColor-white", styles.row) }>
            <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span className="ms-font-xl ms-fontColor-white">
                Welcome to SharePoint!
              </span>
               <div className="ms-Table">

          {

            this.state.lists.map(function(list) {
           return <SPSecurityWebpartTableRow list={list} users={this.states.users}  />;
          }) }
        </div>
              <p className="ms-font-l ms-fontColor-white">
                # of users {this.state.siteUsers.length}

              </p>
              <p className="ms-font-l ms-fontColor-white">
                # of Groups {this.state.siteGroups.length}
              </p>
              <p className="ms-font-l ms-fontColor-white">
                # of Role Definitions {this.state.roleDefinitions.length}
              </p>
              <p className="ms-font-l ms-fontColor-white">
                # of lists{this.state.roleDefinitions.length}
              </p>
              <a
                className={css("ms-Button", styles.button) }
                href="https://github.com/SharePoint/sp-dev-docs/wiki"
                >
                <span className="ms-Button-label">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

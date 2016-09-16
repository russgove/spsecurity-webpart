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
    return (
        // state object has an array of lists and an array of users
       <div className="ms-Table">
          {this.state.lists.map((list) => {
           return <SPSecurityWebpartTableRow list={list}  Users={this.state.siteUsers} roleDefinitions={this.state.roleDefinitions} siteGroups={this.state.siteGroups} />;
          }) }
        </div>
    );

  }
}

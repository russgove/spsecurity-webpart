import * as React from "react";
import { css } from "office-ui-fabric-react";

import {Helpers, SPList, SPSiteUser, SPSiteGroup, SPRoleAssignment, SPRoleDefinition, ISPSecurableObject}from "../spsecurityService";
import styles from "../SpSecurityWebpart.module.scss";
class SPSecurityWebpartTableCell extends React.Component<any, any> {
  public constructor(props) {
    super(props);

  }





  public render(): JSX.Element {
    debugger;
    this.getUserPermissions(this.props.list as SPList, this.props.user as SPSiteUser, this.props.roleDefinitions as SPRoleDefinition[], this.props.siteGroups as SPSiteGroup[]);
    return (<td>{this.props.user.Title} {this.props.list.id}</td>);
  }
}
export default class SPSecurityWebpartTableRow extends React.Component<any, any> {
  public constructor(props) {
    super(props);

  }
  public render(): JSX.Element {
    debugger;
    return (
      <tr>key={this.props.list.id}><td>{this.props.list.title}</td><td>{this.props.list.id}</td>{this.props.Users.map((user) => {
        return <SPSecurityWebpartTableCell user={user}  list={this.props.list} roleDefinitions={this.props.roleDefinitions} siteGroups={this.props.siteGroups}  />;
      }) }</tr>
    );
  }
}

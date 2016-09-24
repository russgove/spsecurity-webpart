import * as React from "react";
import { css } from "office-ui-fabric-react";
import {
  SPPermission

} from "@microsoft/sp-client-base";

import {Helpers, SPList, SPSiteUser, SPSiteGroup, SPRoleDefinition}from "../spsecurityService";
import styles from "../SpSecurityWebpart.module.scss";
class SPSecurityWebpartTableCell extends React.Component<any, any> {
  public constructor(props) {
    super(props);
  }
  public render(): JSX.Element {
    if (Helpers.doesUserHavePermission(this.props.list as SPList, this.props.user as SPSiteUser, SPPermission[this.props.permission], this.props.roleDefinitions as SPRoleDefinition[], this.props.siteGroups as SPSiteGroup[])) {
      return (<td>X</td>);
    }
    else {
      return (<td></td>);
    }
  }
}
class ListIcon extends React.Component<any, any> {
  public constructor(props) {
    super(props);
  }
 public  handleClick() {
    debugger;
    this.props.expandFolder();
  }
  public render(): JSX.Element {
    if (this.props.list.itemCount >0){
      return (<td onClick={this.handleClick}><i className="ms-Icon ms-Icon--Mail" aria-hidden="true"></i></td>);
    }
    else {
      return (<td></td>);
    }
  }
}
export default class SPSecurityWebpartTableRow extends React.Component<any, any> {
  public constructor(props) {
    super(props);
  }
  public render(): JSX.Element {
    return (
      <tr>key={this.props.list.id}>
        <ListIcon list={this.props.list}></ListIcon>
        <td>{this.props.list.title}</td>

        {this.props.Users.map((user) => {
          return <SPSecurityWebpartTableCell user={user}  list={this.props.list} roleDefinitions={this.props.roleDefinitions} siteGroups={this.props.siteGroups} permission={this.props.permission}  />;
        }) }</tr>
    );
  }
}

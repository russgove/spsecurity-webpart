import * as React from "react";
import { css } from "office-ui-fabric-react";
import spSecurityService from "../spsecurityService";
import {SPList, SPSiteUser}from "../spsecurityService";
import styles from "../SpSecurityWebpart.module.scss";
export default class SPSecurityWebpartTableRow extends React.Component<any, any> {
  public constructor(props) {
    super(props);

  }
  public render(): JSX.Element {
    debugger;
    return (
      <tr>key={this.props.list.id}><td>{this.props.list.title}</td><td>{this.props.list.id}</td></tr>
    );
  }
}

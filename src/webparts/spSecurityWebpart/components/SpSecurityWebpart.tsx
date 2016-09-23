import * as React from "react";
import { css } from "office-ui-fabric-react";
import spSecurityService from "../spsecurityService";
import {SPSecurityInfo}from "../spsecurityService";
import SPSecurityWebpartTableRow from "./SPSecurityWebpartTableRow";
import styles from "../SpSecurityWebpart.module.scss";
import { ISpSecurityWebpartWebPartProps } from "../ISpSecurityWebpartWebPartProps";
import configureStore from "../redux/store";
import {ActionCreators } from "../redux/actions";

export interface ISpSecurityWebpartProps extends ISpSecurityWebpartWebPartProps {
}

export default class SpSecurityWebpart extends React.Component<ISpSecurityWebpartProps, any> {
  private svc: spSecurityService = new spSecurityService("ss");
  private reduxUnsibsribeFunction;
  private store;
  public componentWillMount(): void {
    debugger;


    this.reduxUnsibsribeFunction = this.store.subscribe(() => {
      this.setState(this.store.getState());
    });
    this.store.dispatch(ActionCreators.setSttatus("Initializing"));
    this.svc.loadData(false).then((response) => {
      this.store.dispatch(ActionCreators.init(response as SPSecurityInfo));
    });
  }
  public componentWillUnMount(): void {
    this.reduxUnsibsribeFunction();
  }
  public constructor(props) {
    super(props);
    debugger;
    this.store = configureStore({});

  }
  public getInitialState() {
    debugger;

    return this.store.getState();
  }

  public render(): JSX.Element {
    debugger;
    return (
      <table className="ms-Table">
        <tr>
          <td>List Title</td>

          {this.state.securityInfo.siteUsers.map((user) => {
            return (<td className={css('ms-grid-col', styles.rotate) }> {user.name} </td>);
          }) }
        </tr>
        {this.state.securityInfo.lists.map((list) => {
          return <SPSecurityWebpartTableRow list={list}  Users={this.state.securityInfo.siteUsers} roleDefinitions={this.state.securityInfo.roleDefinitions} siteGroups={this.state.securityInfo.siteGroups} permission={this.props.permission}/>;
        }) }
      </table>
    );

  }
}

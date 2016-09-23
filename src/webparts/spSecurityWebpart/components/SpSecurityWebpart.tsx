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

export default class SpSecurityWebpart extends React.Component<ISpSecurityWebpartProps, SPSecurityInfo> {
  private svc: spSecurityService = new spSecurityService("ss");
  private reduxUnsibsribeFunction;
  public componentWillMount(): void {

    const store = configureStore({});
    this.setState(store.getState);
    this.reduxUnsibsribeFunction = store.subscribe(() => {
      this.setState(store.getState());
    });
    store.dispatch(ActionCreators.setSttatus("Initializing"));
    this.svc.loadData(false).then((response) => {
      store.dispatch(ActionCreators.init(response as SPSecurityInfo));
    });
  }
  public componentWillUnMount(): void {
    this.reduxUnsibsribeFunction();
  }
  public constructor(props) {
    super(props);

    this.state = new SPSecurityInfo();

  }

  public render(): JSX.Element {

    return (
      <table className="ms-Table">
        <tr>
          <td>List Title</td>

          {this.state.siteUsers.map((user) => {
            return (<td className={css('ms-grid-col', styles.rotate) }> {user.name} </td>);
          }) }
        </tr>
        {this.state.lists.map((list) => {
          return <SPSecurityWebpartTableRow list={list}  Users={this.state.siteUsers} roleDefinitions={this.state.roleDefinitions} siteGroups={this.state.siteGroups} permission={this.props.permission}/>;
        }) }
      </table>
    );

  }
}

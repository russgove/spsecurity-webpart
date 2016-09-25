import * as React from "react";
import { css } from "office-ui-fabric-react";
import spSecurityService from "../spsecurityService";
import {SPSecurityInfo, SPList}from "../spsecurityService";
import SPSecurityWebpartTableRow from "./SPSecurityWebpartTableRow";
import styles from "../SpSecurityWebpart.module.scss";
import { ISpSecurityWebpartWebPartProps } from "../ISpSecurityWebpartWebPartProps";
import configureStore from "../redux/store";
import {ActionCreators } from "../redux/actions";
import thunkMiddleware from 'redux-thunk'

export interface ISpSecurityWebpartProps extends ISpSecurityWebpartWebPartProps {
}

export default class SpSecurityWebpart extends React.Component<ISpSecurityWebpartProps, any> {
  private svc: spSecurityService = new spSecurityService("ss");
  private reduxUnsibsribeFunction;
  private store;
  public componentWillMount(): void {



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
    this.store = configureStore({});
  }
  public getInitialState() {
    debugger;
    return this.store.getState();
  }
  public expandFolder(list: SPList) {
    if (list.isExpanded) {
      this.store.dispatch(ActionCreators.collapseFolder);// alreade expanded , sol collapse it
    }
    else {
      if (list.hasBeenRetrieved) {
        this.store.dispatch(ActionCreators.expandFolder);// we alreayd have the data so just expand it
      }
      else {
        this.store.dispatch(ActionCreators.getFolder);// get the data, them expand it
      }
    }

  }
  public render(): JSX.Element {
    debugger;
    return (
      <table className="ms-Table">
        <tr>
          <td>+</td>
          <td>List Title</td>

          {this.state.securityInfo.siteUsers.map((user) => {
            return (<td className={css('ms-grid-col', styles.rotate) }> {user.name} </td>);
          }) }
        </tr>
        {this.state.securityInfo.lists.map((list) => {

          return <SPSecurityWebpartTableRow expandFolder={this.expandFolder} list={list}  Users={this.state.securityInfo.siteUsers} roleDefinitions={this.state.securityInfo.roleDefinitions} siteGroups={this.state.securityInfo.siteGroups} permission={this.props.permission}/>;
        }) }
      </table>
    );

  }
}

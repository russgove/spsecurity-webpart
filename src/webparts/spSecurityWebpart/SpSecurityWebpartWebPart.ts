import * as React from "react";
import * as ReactDom from "react-dom";
import {
  SPPermission,
  Log
} from "@microsoft/sp-client-base";
import {ActionCreators } from "./redux/actions";
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from "@microsoft/sp-client-preview";
import * as strings from "mystrings";
import SpSecurityWebpart, { ISpSecurityWebpartProps } from "./components/SpSecurityWebpart";
import { ISpSecurityWebpartWebPartProps,
  SpSecurityWebpartWebPartProps } from "./ISpSecurityWebpartWebPartProps";
export default class SpSecurityWebpartWebPart extends BaseClientSideWebPart<ISpSecurityWebpartWebPartProps> {

  private webPartComponent: any;
  public constructor(context: IWebPartContext) {
    super(context);
    debugger;
  }
  public onPropertyChange(propertyPath: string, newValue: any) {
    debugger;
    super.onPropertyChange(propertyPath, newValue);
    switch (propertyPath) {
      case "permission":
        let act = ActionCreators.selectPermission(newValue);
        this.webPartComponent.store.dispatch(act);
        break;
      default:
        break;
    }

  }
  public render(): void {
    debugger;
    const element: React.ReactElement<ISpSecurityWebpartProps> = React.createElement(SpSecurityWebpart, this.properties);
    this.webPartComponent = ReactDom.render(element, this.domElement);

  }
  public getPermissionTypes() {
    let perms = new Array();
    for (const perm in SPPermission) {
      Log.verbose("getPermissionTypes", "name is " + perm + " type is " + typeof (SPPermission[perm]));
      if (typeof (SPPermission[perm]) === "object") {
        perms.push({
          text: perm,
          key: perm
        });
      }
    }
    return perms;
  }
  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown("permission", {
                  label: "Permission Type",
                  options: this.getPermissionTypes()
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

import * as React from "react";
import * as ReactDom from "react-dom";
import {
  SPPermission,
  Log
} from "@microsoft/sp-client-base";

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

  public constructor(context: IWebPartContext) {
    super(context);

  }


  public render(): void {
    debugger;


    const element: React.ReactElement<ISpSecurityWebpartProps> = React.createElement(SpSecurityWebpart, this.properties);

    ReactDom.render(element, this.domElement);



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

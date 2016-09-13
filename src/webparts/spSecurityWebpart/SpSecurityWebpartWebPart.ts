import * as React from "react";
import * as ReactDom from "react-dom";
import spSecurityService from "./spsecurityService";
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField
} from "@microsoft/sp-client-preview";
import { SPSiteUser, SPSiteGroup} from "./spsecurityservice";

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

    let props: SpSecurityWebpartWebPartProps = new SpSecurityWebpartWebPartProps();
    props.description = this.properties.description;
    const element: React.ReactElement<ISpSecurityWebpartProps> = React.createElement(SpSecurityWebpart, props);

    ReactDom.render(element, this.domElement);



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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

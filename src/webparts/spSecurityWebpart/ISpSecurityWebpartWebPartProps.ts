import {SPSiteUser} from "./spsecurityservice";
import {
  SPPermission,
  Log
} from "@microsoft/sp-client-base";

export interface ISpSecurityWebpartWebPartProps {
  description: string;
  users: SPSiteUser[];
  permission:SPPermission;
}

export class SpSecurityWebpartWebPartProps implements ISpSecurityWebpartWebPartProps{
  public description: string;
  public users: SPSiteUser[];
  public permission:SPPermission;
}
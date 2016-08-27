import {SPSiteUser} from './spsecurityservice';
export interface ISpSecurityWebpartWebPartProps {
  description: string;
  users: SPSiteUser[];
}

export class SpSecurityWebpartWebPartProps implements ISpSecurityWebpartWebPartProps{
  public description: string;
  public users: SPSiteUser[];
}
import {
  SELECTPERMISSION
} from "../constants";


const INITIAL_STATE = {
 status: "UNINITIALIZED"
};
export default class StatusReducer {
  public static statusReducer(state = INITIAL_STATE, action = { type: "" }) {
    switch (action.type) {

      //  case SELECTPERMISSION:

      default:
        return state;
    }
  }
}

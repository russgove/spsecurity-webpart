import {
  SELECTPERMISSION
} from "../constants";
import { fromJS } from "immutable";
const INITIAL_STATE = {
  selectedPermission: "read"
};
export default class FilterReducer {
  public static filterReducer(state = INITIAL_STATE, action = { type: "" }) {
    switch (action.type) {
      //  case SELECTPERMISSION:
      default:
        return state;
    }
  }
}

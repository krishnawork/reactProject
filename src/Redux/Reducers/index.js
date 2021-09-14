import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import searchReducer from "./search.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
});

export default rootReducer;

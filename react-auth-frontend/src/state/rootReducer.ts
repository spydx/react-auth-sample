import { combineReducers } from "redux";
import authReducer from './reducers/Auth';
import accountReducer from './reducers/Account';

export const rootReducer = combineReducers({
   auth: authReducer,
   account: accountReducer,
});


export type RootState = ReturnType<typeof rootReducer>;


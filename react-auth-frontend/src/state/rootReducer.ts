import { combineReducers } from "redux";
import authReducer from './reducers/Auth';

export const rootReducer = combineReducers({
   auth: authReducer,
});



export type RootState = ReturnType<typeof rootReducer>;


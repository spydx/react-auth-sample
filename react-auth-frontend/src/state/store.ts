import { CombinedState, configureStore } from "@reduxjs/toolkit";
import { rootReducer} from './rootReducer';
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import {AuthState } from '../state/reducers/Auth';

const customMiddelware = getDefaultMiddleware();
const middelware = [...customMiddelware, logger]

export const store = configureStore({
   reducer: rootReducer,
   middleware: middelware
});

const saveState = (state: CombinedState<AuthState>) => {

   try {
      if(state.token === null) {
         localStorage.removeItem('authtoken')
      } else {
         localStorage.setItem('authtoken', state.token)
      }
         
   } catch (error) {
      
   }
}
store.subscribe( () => {
   saveState(store.getState().auth);
})

export type AppDispatch = typeof store.dispatch;

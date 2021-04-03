import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegisterAccount } from '../../views/SignIn';

export type AccountState = {
   name: string | null
   email: string | null
   registered: boolean,
   loading: boolean
}

const initialState : AccountState = {
   name: null,
   email: null,
   registered: true,
   loading: false,
}

export const accountSlice = createSlice({
   name: "account",
   initialState: initialState,
   reducers: {
      registerAccount(state, action: PayloadAction<RegisterAccount>) {
         state.email = action.payload.email;
         state.name = action.payload.name;
         state.registered = true;
         state.loading = false;
      },
      showRegisterView(state, action: PayloadAction<boolean>) {
         state.registered = !action.payload;
      }
      
   }
});

export const { registerAccount, showRegisterView }  = accountSlice.actions
export default accountSlice.reducer;
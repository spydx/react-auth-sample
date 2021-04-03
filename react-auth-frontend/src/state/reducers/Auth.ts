import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type AuthState = {
   token: string | null
   loading: boolean
   authenticated: boolean
   error: boolean
}


const initialState: AuthState = {
   token: null,
   loading: false,
   authenticated: false,
   error: false
}


export const authSlice = createSlice({
   name: "auth",
   initialState: initialState,
   reducers: {
      loginSuccess(state, action: PayloadAction<string>) {
         state.token = action.payload;
         state.loading = false;
         state.authenticated = true;
         state.error = false;
      }, 
      logout(state, action: PayloadAction<boolean>) {
         state.token = "";
         state.loading = false;
         state.error = false;
         state.authenticated = !action.payload;
      },
      loginError(state, action: PayloadAction<boolean>) {
         state.error = true;
      }
   }
});

export const { loginSuccess, loginError, logout} = authSlice.actions;
export default authSlice.reducer;
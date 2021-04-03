import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type AuthState = {
   token: string | null
   loading: boolean
   authenticated: boolean
}


const initialState: AuthState = {
   token: null,
   loading: false,
   authenticated: false
}


export const authSlice = createSlice({
   name: "auth",
   initialState: initialState,
   reducers: {
      loginSuccess(state, action: PayloadAction<string>) {
         state.token = action.payload;
         state.loading = false;
         state.authenticated = true;
      }, 
      logout(state, action: PayloadAction<boolean>) {
         state.token = "";
         state.loading = false;
         state.authenticated = !action.payload;
      }
   }
});

export const { loginSuccess, logout} = authSlice.actions;
export default authSlice.reducer;
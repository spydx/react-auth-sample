import axios from "axios";
import useSWR from "swr";

export const apiRoot: string = process.env.REACT_APP_BACKEND_ENDPOINT || "http://localhost:8080/api"

const REGISTER_URL: string = '/api/auth/register';
const LOGIN_URL: string = '/api/auth/login';

const AUTHORIZATION:string = "Authorization";
const BEARER:string = "Bearer ";

const APPLICATIONJSON:string = "application/json"
const CONTENTTYPE:string = "Content-Type"


export const fetcher = (url:string) => fetch(`${apiRoot}${url}`)
   .then(res => res.json);

const poster = (url:string, content:string) => fetch(`${apiRoot}${url}`, {
      method: "POST",
      headers: {
         CONTENTTYPE: APPLICATIONJSON, 
      },
      body: content
   })
   .then(res => res.json);


const authFetcher = (url:string) => axios.get(`${apiRoot}${url}`, { headers: {
   AUTHORIZATION: BEARER, 
   CONTENTTYPE: APPLICATIONJSON
}}).then(res => res.data);

const authPoster = (url:string, content: string) => 
    axios.post(`${apiRoot}${url}`, { headers: {
      AUTHORIZATION:BEARER,
      CONTENTTYPE: APPLICATIONJSON,
      
   },
   body: content
   }).then(res => res.data);

export function useCreateAccount (content: string) {
   const { data, error } = useSWR([`/api/auth/register`, content] , poster)

   return {
      created: data,
      isLoading: !error && !data,
      isError: error
   }

}

/*
export function useLogin (content: string) {
   const { data, error } = useSWR<LoggedIn>([`/api/auth/login`, content] , poster);

   return { 
      loggedin: data,
      isLoading: !error && !data,
      isError: error
   }
}*/



export function useProfile (id:string) {
   const { data, error } = useSWR(`/api/accounts/${id}`, fetcher)

   return {
      user: data, 
      isLoading: !error && !data,
      isError: error
   }
}


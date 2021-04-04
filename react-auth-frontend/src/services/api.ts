export const apiRoot: string = process.env.REACT_APP_BACKEND_ENDPOINT || "http://localhost:8080/api"
/*
const REGISTER_URL: string = '/api/auth/register';
const LOGIN_URL: string = '/api/auth/login';

const AUTHORIZATION:string = "Authorization";
const BEARER:string = "Bearer ";

const APPLICATIONJSON:string = "application/json"
const CONTENTTYPE:string = "Content-Type"

*/
export const fetcher = (url:string) => fetch(`${apiRoot}${url}`)
   .then(res => res.json);

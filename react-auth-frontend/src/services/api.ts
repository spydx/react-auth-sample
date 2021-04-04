export const apiRoot: string = process.env.REACT_APP_BACKEND_ENDPOINT 
                  || "http://localhost:8080/api"
export const LOGIN_PATH = '/auth/login' ;
export const REGISTER_PATH = '/auth/register'

const POST_METHOD:string = 'POST';
const APPLICATIONJSON:string = "application/json";

export const fetcher = (url:string) => fetch(`${apiRoot}${url}`)
   .then(res => res.json);

export const poster = (url:string, data: string) => fetch(`${apiRoot}${url}`, {
      method: POST_METHOD,
      headers: { "Content-Type": APPLICATIONJSON},
      body: data
   });
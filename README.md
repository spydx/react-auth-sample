# React Auth Sample

 [![React-Auth-Backend CI](https://github.com/spydx/react-auth-sample/actions/workflows/react-auth-backend.yml/badge.svg)](https://github.com/spydx/react-auth-sample/actions/workflows/react-auth-backend.yml)
[![React-Auth-Frontend CI](https://github.com/spydx/react-auth-sample/actions/workflows/react-auth-frontend.yml/badge.svg)](https://github.com/spydx/react-auth-sample/actions/workflows/react-auth-frontend.yml)

Small sample project with React frontend and a simple Rust backend.

## Running the sample

It is several ways to run this project.

### Using Docker

Simple commands:

```sh
$ docker-compose up
```

Then open your favorite browser to [react-auth-sample](http://localhost:80)

### Manual

To do this version, you will have to have `rust build tools` and `yarn` installed.

```sh
react-auth-backend $ cargo run
```

```sh
react-auth-frontend $ yarn install
react-auth-frontend $ yarn start
```

Then open your favorite browser to [react-auth-sample](http://localhost:80)

## Documentation

### Backend

The backend has three endpoints:

- POST `/api/auth/register` - register an account in the system
- POST `/api/auth/login` - log in the registerd user
- GET `/api/accounts/` - view all accounts on the system

The last endpoint is just there for making it easier to debug,
being able to show all registerd users in the system.

The backend only stores the users in memory, and will discard them if the service is restarted.

An account is consisting of a users name, email and password.
The password is hashed with [Argon2](https://www.argon2.com/) and stored in the service. The hash should be stores in a DB, but that is out of scope for this service.

When a uses is logging in, the user supplies it's email and password, and will get a [JSON Web Token](https://jwt.io/) generated that is stored in the React app (Frontend) so the users is authenticated, this token gets discarded when the user logges out.

CORS has been configured in the [Actix Web Framwork](https://actix.rs) for Rust.
It's configured to allow all headers, origins and methods.
Not recommended, but will suffice for our test environment here.

There is no option to delete users.
### Register

Takes in a JSON message constructed like this:

```json
{
   "name": "yourname",
   "email": "email@email.ee",
   "password":"yoursecretpassword"
}
```

Example:

```sh
$ curl http://localhost:8080/api/auth/register \\
   -H "Content-type:application/json" \\
   -d "{ \"name\":\"yourname\", \"email\":\"email@mail.ee\", 
   \"password\": \"password\" }"
```

Returns this to you

```json
{
   "name":"yourname",
   "email":"email@mail.ee"
}
```

It is not good pratice to return the password hash.

## Login

Takes in a JSON message constructed like this:

```json
{
   "email": "email@email.ee",
   "password":"password"
}
```

Example:

```sh
$ curl http://localhost:8080/api/auth/login \\
   -H "Content-type:application/json" \\
   -d "{ \"email\":\"email@mail.ee\", \"password\": \"password\" }"
```

That returns this content to you:

```json
{  
   "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbWFpbEBtYWlsLmVlIiwiZXhwIjoxNjE3NDgyMzQ0fQ.PCrcAFXyQPM42wY82KaDnhMyp85AUg-LpEqJiqOL7aD28au84o53pUTImkR3m4GSLjDUGdyFpTokZPwOJ30tZw"
}
````








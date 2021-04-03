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
````

Then open your favorite browser to [react-auth-sample](http://localhost:80)

#


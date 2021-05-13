mod controllers;
mod hashing;
mod structs;

use actix_web::{middleware, web, App, HttpServer};

use crate::controllers::{get_accounts, post_login, post_register};
use crate::structs::AppState;
use actix_cors::Cors;
use std::sync::Mutex;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Hello, world!");

    let root = "/api";
    let binding = "0.0.0.0:8080";

    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let inital_state = web::Data::new(AppState {
        accounts: Mutex::new(Vec::new()),
    });

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_header()
            .allow_any_method();

        App::new()
            .app_data(inital_state.clone())
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .service(
                web::scope(&root)
                    .service(get_accounts)
                    .service(post_login)
                    .service(post_register),
            )
    })
    .bind(&binding)?
    .run()
    .await
}

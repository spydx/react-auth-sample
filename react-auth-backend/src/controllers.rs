use actix_web::{ get, post, web, HttpResponse, Responder};
use crate::hashing::{verify, hash, create_jwt};
use crate::structs::{AppState, LoginRequest, LoginResponse, RegisterRequest, Account};

#[post("/auth/login")]
pub async fn post_login(state: web::Data<AppState>, data: web::Json<LoginRequest>) -> impl Responder {
    format!("Hello from login: {}: {}", data.email, data.password);
    let accounts = state.accounts.lock().unwrap();

    let found = accounts.iter()
        .find(|&acc| acc.email == data.email);

    match found {
        Some(a) => {
            let valid = verify(&a.password,data.password.as_str());
            if !valid {
                HttpResponse::Unauthorized().body("Unauthorized account")
            } else {
                let jwt = create_jwt(&data.email);
                let tokenresponse = LoginResponse { token: jwt };
                HttpResponse::Ok().json(tokenresponse)
            }
        },
        _ => HttpResponse::NoContent().body("Unable to find account")
    }
}

#[post("/auth/register")]
pub async fn post_register(state: web::Data<AppState>, data: web::Json<RegisterRequest>) -> impl Responder {
    let mut accounts = state
        .accounts.lock()
        .unwrap();
    let hashedpasswd = hash(&data.password.as_str());

    // create a password hash
    let newaccount = Account {
        name: data.name.clone(),
        email: data.email.clone(),
        password: hashedpasswd };

    accounts.push(newaccount.clone());
    println!("{}",&newaccount);
    HttpResponse::Ok().json(&newaccount)

}

#[get("/accounts/")]
pub async fn get_accounts(state: web::Data<AppState>) -> impl Responder {
    let accounts = state.accounts.lock().unwrap();
    for x in accounts.iter() {
        println!("> {}", x)
    }
    HttpResponse::Ok().json(&*accounts)
}

#[cfg(test)]
mod controller_tests {
    use super::*;
    use crate::hashing::{hash, create_jwt};
    use actix_web::{App,test, web};
    use serde_json::json;
    use std::sync::Mutex;
    use crate::structs::AccountDTO;

    #[actix_rt::test]
    async fn test_register_user() {
        let name = "Kenneth";
        let mail = "kenneth@kenneth.no";
        let password = "superpassword";

        let registeruser = RegisterRequest {
            name: name.to_string(),
            email: mail.to_string(),
            password: password.to_string() };

        let inital_state = web::Data::new(
            AppState {
                accounts: Mutex::new(Vec::new()),
            }
        );
        let mut app = test::init_service(
            App::new()
                .app_data(inital_state.clone())
                .service(web::scope("/api")
                    .service(post_register))).await;

        let jsonreq = json!(registeruser);

        let resp = test::TestRequest::post()
            .uri("/api/auth/register")
            .set_json(&jsonreq)
            .send_request(&mut app).await;
        assert!(resp.status().is_success(), "Failed to create user");
        let a: AccountDTO = test::read_body_json(resp).await;

        assert_eq!(a.name, name);
        assert_eq!(a.email, mail);
    }

    #[actix_rt::test]
    async fn test_login_user() {
        let name = "Kenneth";
        let mail = "kenneth@kenneth.no";
        let password = "superpassword";

        let user = Account {
            name: name.to_string(),
            email: mail.to_string(),
            password: hash(password) };

        let inital_state = web::Data::new(
            AppState {
                accounts: Mutex::new(Vec::new()),
            }
        );
        inital_state.accounts.lock().unwrap().push(user);

        let mut app = test::init_service(
            App::new()
                .app_data(inital_state.clone())
                .service(web::scope("/api")
                    .service(post_login))
        ).await;

        let loginreq = json!(LoginRequest {
            email: mail.to_string(),
            password: password.to_string(),
        });

        let login = test::TestRequest::post()
            .uri("/api/auth/login")
            .set_json(&loginreq)
            .send_request(&mut app).await;

        assert!(login.status().is_success(), "Failed to login");
        let l:LoginResponse = test::read_body_json(login).await;
        assert_eq!(l.token, create_jwt(&mail));
    }


    #[actix_rt::test]
    async fn test_login_failed_user() {
        let name = "Kenneth";
        let mail = "kenneth@kenneth.no";
        let password = "superpassword";

        let user = Account {
            name: name.to_string(),
            email: mail.to_string(),
            password: hash(password) };

        let inital_state = web::Data::new(
            AppState {
                accounts: Mutex::new(Vec::new()),
            }
        );
        inital_state.accounts.lock().unwrap().push(user);

        let mut app = test::init_service(
            App::new()
                .app_data(inital_state.clone())
                .service(web::scope("/api")
                    .service(post_login))
        ).await;

        let loginreq = json!(LoginRequest {
            email: mail.to_string(),
            password: "whatismypassword".to_string(),
        });

        let login = test::TestRequest::post()
            .uri("/api/auth/login")
            .set_json(&loginreq)
            .send_request(&mut app).await;

        assert_eq!(login.status().as_str(), "401");
        let nouser = json!(LoginRequest {
            email: "fantasy@email.com".to_string(),
            password: "whatismypassword".to_string(),
        });
        let nocontent = test::TestRequest::post()
            .uri("/api/auth/login")
            .set_json(&nouser)
            .send_request(&mut app).await;

        assert_eq!(nocontent.status().as_str(), "204")
    }


    #[actix_rt::test]
    async fn test_get_user() {
        let name = "Kenneth";
        let mail = "kenneth@kenneth.no";
        let password = "superpassword";

        let user = Account {
            name: name.to_string(),
            email: mail.to_string(),
            password: hash(password) };

        let inital_state = web::Data::new(
            AppState {
                accounts: Mutex::new(Vec::new()),
            }
        );
        inital_state.accounts.lock().unwrap().push(user);

        let mut app = test::init_service(
            App::new()
                .app_data(inital_state.clone())
                .service(web::scope("/api")
                    .service(get_accounts))
        ).await;

        let user = test::TestRequest::get()
            .uri("/api/accounts/")
            .send_request(&mut app).await;

        assert!(user.status().is_success());
        let a: Vec<AccountDTO> = test::read_body_json(user).await;

        assert_eq!(a.first().unwrap().name, name);
        assert_eq!(a.first().unwrap().email, mail);
    }
}
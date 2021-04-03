use actix_web::{middleware,get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Serialize, Deserialize};
use sodiumoxide::crypto::pwhash::argon2id13;
use jsonwebtoken::{ encode, Algorithm,  EncodingKey, Header};
use actix_cors::Cors;

use std::sync::Mutex;
use std::{fmt};

use chrono::Utc;

const JWT_SECRET: &[u8] = b"omgSOs3cret";

#[derive(Serialize)]
struct AppState {
    accounts: Mutex<Vec<Account>>,
}

#[derive(Serialize,Deserialize, Debug,Clone)]
struct Account {
    name: String,
    email: String,
    password: String,
}

impl fmt::Display for Account {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "(name: {}, email: {}, password: {})", self.name, self.email, self.password )
    }
}

#[derive(Serialize,Deserialize)]
struct LoginRequest {
    email: String,
    password: String,
}

#[derive(Serialize, Deserialize)]
struct ReqisterRequest {
    name: String,
    email: String,
    password: String,
}

#[derive(Serialize,Deserialize, Debug)]
struct LoginResponse {
    token: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct Claims {
    sub: String,
    exp: usize,
}

#[post("/auth/login")]
async fn post_login(state: web::Data<AppState>, data: web::Json<LoginRequest>) -> impl Responder {
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
async fn post_register(state: web::Data<AppState>, data: web::Json<ReqisterRequest>) -> impl Responder {
    let mut accounts = state
        .accounts.lock()
        .unwrap();
    let hashedpasswd = hash(&data.password.as_str());

    // create a password hash
    let newaccount = Account {
        name: data.name.clone(),
        email: data.email.clone(),
        password: hashedpasswd
    };

    accounts.push(newaccount.clone());
    println!("{}",&newaccount);
    HttpResponse::Ok().json(&newaccount)

}

#[get("/accounts/")]
async fn get_accounts(state: web::Data<AppState>) -> impl Responder {
    let accounts = state.accounts.lock().unwrap();
    for x in accounts.iter() {
        println!("> {}", x)
    }
    HttpResponse::Ok().json(&*accounts)
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Hello, world!");

    let root = "/api";
    let binding = "0.0.0.0:8080";

    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let inital_state = web::Data::new(
        AppState {
            accounts: Mutex::new(Vec::new()),
        }
    );

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_header()
            .allow_any_method();

        App::new()
            .app_data(inital_state.clone())
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .service(web::scope(&root)
                .service(get_accounts)
                .service(post_login)
                .service(post_register))
    })
    .bind(&binding)?
    .run()
    .await
}


fn hash(password: &str) -> String {
    sodiumoxide::init().unwrap();
    let hash = argon2id13::pwhash(
        password.as_bytes(),
        argon2id13::OPSLIMIT_INTERACTIVE,
        argon2id13::MEMLIMIT_INTERACTIVE
    ).unwrap();

    let texthash = std::str::from_utf8(&hash.0)
        .unwrap().trim_end_matches('\u{0}').to_string();

    texthash
}

fn verify(hash: &str, password: &str) -> bool {
    let mut paddedhash = [0u8; 128];
    hash.as_bytes().iter().enumerate().for_each(|(i,value) | {
        paddedhash[i] = value.clone();
    });

    sodiumoxide::init().unwrap();
    match argon2id13::HashedPassword::from_slice(&paddedhash) {
        Some(hp) => argon2id13::pwhash_verify(&hp, password.as_bytes()),
        _ => false,
    }
}

fn create_jwt(user: &str) -> String {
    let expire = Utc::now()
        .checked_add_signed(chrono::Duration::seconds(60))
        .expect("valid timestamp")
        .timestamp();

    let claims = Claims {
        sub: user.to_owned(),
        exp: expire as usize,
    };

    let header = Header::new(Algorithm::HS512);
    encode(&header, &claims , &EncodingKey::from_secret(JWT_SECRET)).unwrap()
}



#[cfg(test)]
mod tests {
    use super::*;
    use crate::{hash, verify, create_jwt, Claims, JWT_SECRET};
    use jsonwebtoken::{DecodingKey, Validation, Algorithm, decode};
    use actix_web::{test};
    use serde_json::json;

    #[test]
    fn create_password_and_verify() {
        let password = "supersecret";
        let hashedpwd = hash(password);
        println!("Hashed password: {} ", hashedpwd);

        match verify(hashedpwd.as_str(), password) {
            true => println!("Password validated"),
            _ => panic!("Failed test")
        }
    }

    #[test]
    fn create_jwt_token_and_decode_it() {
        let email = "cool@emial.com";
        let jwt = create_jwt(&email);

        let decoded = decode::<Claims>(
            &jwt,
            &DecodingKey::from_secret(JWT_SECRET),
            &Validation::new(Algorithm::HS512),
        );

        assert_eq!(email, decoded.unwrap().claims.sub);
    }

    #[actix_rt::test]
    async fn test_register_user() {
        let name = "Kenneth";
        let mail = "kenneth@kenneth.no";
        let password = "superpassword";

        let registeruser = ReqisterRequest {
            name: name.to_string(),
            email: mail.to_string(),
            password: password.to_string(),
        };

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
        let a: Account = test::read_body_json(resp).await;

        assert_eq!(a.name, name);
        assert_eq!(a.email, mail);
        assert_eq!(verify(a.password.as_str(), password), true);
    }

    #[actix_rt::test]
    async fn test_login_user() {
        let name = "Kenneth";
        let mail = "kenneth@kenneth.no";
        let password = "superpassword";

        let registeruser = ReqisterRequest {
            name: name.to_string(),
            email: mail.to_string(),
            password: password.to_string(),
        };

        let inital_state = web::Data::new(
            AppState {
                accounts: Mutex::new(Vec::new()),
            }
        );
        let mut app = test::init_service(
            App::new()
                .app_data(inital_state.clone())
                .service(web::scope("/api")
                    .service(post_register)
                    .service(post_login))
        ).await;

        let jsonreq = json!(registeruser);

        let resp = test::TestRequest::post()
            .uri("/api/auth/register")
            .set_json(&jsonreq)
            .send_request(&mut app).await;
        assert!(resp.status().is_success(), "Failed to create user");
        let a: Account = test::read_body_json(resp).await;

        assert!(!a.name.is_empty());
        assert!(!a.email.is_empty());
        assert!(!a.password.is_empty());

        let loginreq = json!(LoginRequest {
            email: registeruser.email,
            password: registeruser.password,
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

        let registeruser = ReqisterRequest {
            name: name.to_string(),
            email: mail.to_string(),
            password: password.to_string(),
        };

        let inital_state = web::Data::new(
            AppState {
                accounts: Mutex::new(Vec::new()),
            }
        );
        let mut app = test::init_service(
            App::new()
                .app_data(inital_state.clone())
                .service(web::scope("/api")
                    .service(post_register)
                    .service(post_login))
        ).await;

        let jsonreq = json!(registeruser);

        let resp = test::TestRequest::post()
            .uri("/api/auth/register")
            .set_json(&jsonreq)
            .send_request(&mut app).await;
        assert!(resp.status().is_success(), "Failed to create user");

        let loginreq = json!(LoginRequest {
            email: registeruser.email,
            password: "whatismypassword".to_string(),
        });

        let login = test::TestRequest::post()
            .uri("/api/auth/login")
            .set_json(&loginreq)
            .send_request(&mut app).await;

        assert!(login.status().is_client_error(), "Managed to login");
    }
}

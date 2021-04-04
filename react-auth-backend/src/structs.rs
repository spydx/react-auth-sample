use serde::{Serialize, Deserialize};
use std::sync::Mutex;
use std::{fmt};

#[derive(Serialize)]
pub struct AppState {
    pub accounts: Mutex<Vec<Account>>,
}

#[derive(Serialize,Deserialize, Debug,Clone)]
pub struct Account {
    pub name: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password: String,
}

#[derive(Serialize,Deserialize, Debug,Clone)]
pub struct AccountDTO {
    pub name: String,
    pub email: String,
}

impl fmt::Display for Account {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "(name: {}, email: {}, password: {})", self.name, self.email, self.password )
    }
}

#[derive(Serialize,Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct RegisterRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize,Deserialize, Debug)]
pub struct LoginResponse {
    pub token: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::Utc;

    #[test]
    fn create_claims() {
        let mail = "some@email.com";
        let expire = Utc::now()
            .checked_add_signed(chrono::Duration::seconds(60))
            .expect("valid timestamp")
            .timestamp();
        let c = Claims {
            sub: mail.to_string(),
            exp: expire as usize
        };

        assert_eq!(c.sub, mail);
        assert_eq!(c.exp, expire as usize)
    }
}
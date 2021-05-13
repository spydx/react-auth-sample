use crate::structs::Claims;
use chrono::Utc;
use jsonwebtoken::{encode, Algorithm, EncodingKey, Header};
use sodiumoxide::crypto::pwhash::argon2id13;

const JWT_SECRET: &[u8] = b"omgSOs3cret";

pub fn hash(password: &str) -> String {
    sodiumoxide::init().unwrap();
    let hash = argon2id13::pwhash(
        password.as_bytes(),
        argon2id13::OPSLIMIT_INTERACTIVE,
        argon2id13::MEMLIMIT_INTERACTIVE,
    )
    .unwrap();

    let texthash = std::str::from_utf8(&hash.0)
        .unwrap()
        .trim_end_matches('\u{0}')
        .to_string();

    texthash
}

pub fn verify(hash: &str, password: &str) -> bool {
    let mut paddedhash = [0u8; 128];
    hash.as_bytes().iter().enumerate().for_each(|(i, value)| {
        paddedhash[i] = *value;
    });

    sodiumoxide::init().unwrap();
    match argon2id13::HashedPassword::from_slice(&paddedhash) {
        Some(hp) => argon2id13::pwhash_verify(&hp, password.as_bytes()),
        _ => false,
    }
}

pub fn create_jwt(user: &str) -> String {
    let expire = Utc::now()
        .checked_add_signed(chrono::Duration::seconds(60))
        .expect("valid timestamp")
        .timestamp();

    let claims = Claims {
        sub: user.to_owned(),
        exp: expire as usize,
    };

    let header = Header::new(Algorithm::HS512);
    encode(&header, &claims, &EncodingKey::from_secret(JWT_SECRET)).unwrap()
}

#[cfg(test)]
mod hashing_tests {
    use super::*;
    use crate::hashing::{hash, verify};
    use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};

    #[test]
    fn create_password_and_verify() {
        let password = "supersecret";
        let hashedpwd = hash(password);
        assert!(verify(hashedpwd.as_str(), password));
    }

    #[test]
    fn create_password_and_verify_notequal() {
        let password = "supersecret";
        let hashedpwd = hash(password);
        assert!(!verify(hashedpwd.as_str(), "secretsuper"));
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
}

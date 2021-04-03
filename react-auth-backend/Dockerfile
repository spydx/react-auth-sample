# Build fase for Rust
FROM rust:latest as builder

WORKDIR /app

COPY . .

RUN cargo install --path .

# Create Container
FROM debian:bullseye-slim
RUN apt-get update && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/cargo/bin/react-auth-backend /usr/local/bin/react-auth-backend

CMD ["react-auth-backend"]
FROM node:15.9.0-alpine3.10 as build
ENV CI=true

# Arguments
ARG REACT_APP_BACKEND_ENDPOINT
ENV REACT_APP_BACKEND_ENDPOINT=${REACT_APP_BACKEND_ENDPOINT}

RUN touch /env.txt
RUN printenv > /env.txt

WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM nginx:latest as runner

COPY --from=build /app/build /var/www
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /env.txt /env.txt

EXPOSE 80
EXPOSE 443

ENTRYPOINT [ "nginx", "-g","daemon off;" ]
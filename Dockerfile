FROM node:22 AS builder

WORKDIR /app

RUN npm i -g @angular/cli

COPY client/src src
COPY client/package.json .
COPY client/package-lock.json .
COPY client/angular.json .
COPY client/tsconfig.app.json .
COPY client/tsconfig.json .

RUN npm ci
RUN ng build

FROM maven:3.9.9-eclipse-temurin-23 AS bootstrap

ARG APP_DIR=/myapp

WORKDIR ${APP_DIR}

COPY server/src src
COPY server/.mvn .mvn
COPY server/pom.xml .
COPY server/mvnw .
COPY --from=builder app/dist/client/browser src/main/resources/static

RUN mvn clean package -Dmaven.test.skip=true

FROM maven:3.9.9-eclipse-temurin-23

COPY --from=bootstrap /myapp/target/server-0.0.1-SNAPSHOT.jar app.jar

ENV SERVER_PORT=3000

EXPOSE ${SERVER_PORT}

ENTRYPOINT java -jar app.jar

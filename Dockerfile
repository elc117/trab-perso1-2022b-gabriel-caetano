FROM node:slim

WORKDIR /app

COPY . /app

RUN yarn

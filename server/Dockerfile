# Use the official Node.js image as the base image
FROM node:latest as build

WORKDIR /usr/src/app

COPY ./package.json ./
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]
EXPOSE 5000

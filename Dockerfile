FROM node:alpine

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY ./src ./src
CMD yarn start

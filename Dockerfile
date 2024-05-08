FROM node:lts-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk update && apk add --no-cache python3 py3-pip build-base vips-dev

WORKDIR /usr/src/asset-generator

COPY . .

RUN npm ci

CMD ["node",  "index.js"]


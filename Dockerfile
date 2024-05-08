FROM node:lts-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PYTHON=/usr/bin/python

RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /usr/src/asset-generator

COPY . .

RUN npm ci

CMD ["node",  "index.js"]


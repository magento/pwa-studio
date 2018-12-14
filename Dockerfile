FROM node:10.14.1-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY packages/peregrine ./packages/peregrine
COPY packages/pwa-buildpack ./packages/pwa-buildpack
COPY packages/upward-js ./packages/upward-js
COPY packages/upward-spec ./packages/upward-spec
COPY packages/venia-concept ./packages/venia-concept
COPY lerna.json .

RUN apk add --update \
    alpine-sdk \
  && rm -rf /var/cache/apk/* \
  && npm install lerna -g --loglevel notice \
  && npm install --loglevel notice \
  && lerna bootstrap \
  && npm run build

ENV PORT 8080

EXPOSE 8080

CMD [ "npm", "--prefix", "packages/venia-concept", "start"]
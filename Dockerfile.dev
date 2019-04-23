##############################################################
# This file is intended to be used with ./docker-compose.yml #
##############################################################

FROM node:10.14.1-alpine as build
# working directory
WORKDIR /usr/src/app

# global environment setup : yarn + dependencies needed to support node-gyp
RUN apk --no-cache --virtual add \
    python \
    make \
    g++ \
    yarn 

# copy just the dependency files and configs needed for install
COPY packages/peregrine/package.json ./packages/peregrine/package.json
COPY packages/pwa-buildpack/package.json ./packages/pwa-buildpack/package.json
COPY packages/upward-js/package.json ./packages/upward-js/package.json
COPY packages/upward-spec/package.json ./packages/upward-spec/package.json
COPY packages/venia-concept/package.json ./packages/venia-concept/package.json
COPY package.json yarn.lock babel.config.js browserslist.js magento-compatibility.js ./

# install dependencies with yarn
RUN yarn install --frozen-lockfile

# copy over the rest of the package files
COPY packages ./packages

# set in docker-compose
ARG ENVFILEPATH
# copy configuration env file from host file system to venia-concept .env for build
COPY ${ENVFILEPATH} ./packages/venia-concept/.env

# build the app
RUN yarn run build 

# MULTI-STAGE BUILD
FROM node:10.14.1-alpine
# working directory
WORKDIR /usr/src/app
# node:alpine comes with a configured user and group
RUN chown -R node:node /usr/src/app
# copy build from previous stage
COPY --from=build /usr/src/app .
USER node
# Pass the `HOST` arg from docker-compose args and set it to the HOST
ARG HOST
# command to run application
CMD [ "yarn", "workspace", "@magento/venia-concept", "run", "watch", "-- --host ${HOST}"]

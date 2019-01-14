##############################################################
# This file is intended to be used with ./docker-compose.yml #
##############################################################

FROM node:10.14.1-alpine as build
# working directory
WORKDIR /usr/src/app

# global environment setup
RUN npm install lerna -g --loglevel notice

# copy just the dependency files and configs needed for install (utilizes docker cache)
COPY lerna.json .
COPY packages/peregrine/package.json ./packages/peregrine/package.json
COPY packages/pwa-buildpack/package.json ./packages/pwa-buildpack/package.json
COPY packages/upward-js/package.json ./packages/upward-js/package.json
COPY packages/upward-spec/package.json ./packages/upward-spec/package.json
COPY packages/venia-concept/package.json ./packages/venia-concept/package.json
COPY package.json .

# lerna bootstrap/install dependencies with lerna hoisting
RUN lerna bootstrap --hoist

# copy over the rest of the package files
COPY packages ./packages

# copy .env.docker file to .env
COPY ./docker/.env.docker ./packages/venia-concept/.env

# build the app
RUN npm run build 


# MULTI-STAGE BUILD
FROM node:10.14.1-alpine
# create and set non-root USER
RUN addgroup -g 1001 appuser && \
    adduser -S -u 1001 -G appuser appuser
USER appuser

# working directory
WORKDIR /usr/src/app

# copy build from previous stage
COPY --from=build /usr/src/app .

# command to run application
CMD [ "npm", "--prefix", "packages/venia-concept", "run", "watch:docker"]

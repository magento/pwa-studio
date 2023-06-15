##############################################################
# This file is intended to be used with ./docker-compose.yml #
##############################################################

FROM node:14.18.1-alpine as build
# working directory
WORKDIR /usr/src/app

# global environment setup : yarn + dependencies needed to support node-gyp
RUN apk --no-cache --virtual add \
    python3 \
    make \
    g++ \
    yarn

# set env variable for CI
ENV CI=true

# copy root dependency files and configs needed for install
COPY package.json yarn.lock babel.config.js magento-compatibility.js ./
COPY scripts/monorepo-introduction.js ./scripts/monorepo-introduction.js

# copy over the packages
COPY packages ./packages

# run yarn again to reestablish workspace symlinks
RUN yarn install --frozen-lockfile

# build the app
RUN yarn run build

# MULTI-STAGE BUILD
FROM node:14.18.1-alpine
# working directory
WORKDIR /usr/src/app
# node:alpine comes with a configured user and group
RUN chown -R node:node /usr/src/app
# copy build from previous stage
COPY --chown=node:node --from=build /usr/src/app .
USER node
# command to run application
CMD [ "yarn", "workspace", "@magento/venia-concept", "run", "watch"]

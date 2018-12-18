FROM node:10.14.1-alpine

WORKDIR /usr/src/app

# global environment setup
RUN npm install lerna -g --loglevel notice

# copy all the dependency files and run install
COPY package.json .
COPY packages/peregrine/package.json ./packages/peregrine/package.json
COPY packages/pwa-buildpack/package.json ./packages/pwa-buildpack/package.json
COPY packages/upward-js/package.json ./packages/upward-js/package.json
COPY packages/upward-spec/package.json ./packages/upward-spec/package.json
COPY packages/venia-concept/package.json ./packages/venia-concept/package.json
RUN npm install --loglevel notice 

# copy packages and lerna config, then lerna bootstrap with dependency hoisting
COPY packages ./packages
COPY lerna.json .
RUN lerna bootstrap --hoist

# copy environment variables file and build the app
COPY ./packages/venia-concept/.env.docker ./packages/venia-concept/.env
RUN npm run build 

EXPOSE 8080

CMD [ "npm", "--prefix", "packages/venia-concept", "run", "watch"]

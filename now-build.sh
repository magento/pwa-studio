#!/bin/bash -xe

cd ../../
# We set NODE_ENV=production here, instead of in the now.json file. It's not
# obvious, but this build script runs _after_ yarn install. If
# NODE_ENV=production is set _during_ yarn install, it won't install
# devDependencies. So we need to wait until install is done before setting
# NODE_ENV=production to optimize the build step.
export NODE_ENV="production"

# This step will happen _twice_ in yarn deploy: once for the static deploy and
# once to compile the lambda. So instead of a full build, this command runs a
# streamlined build to make only what is essential for deploy.
yarn concurrently 'yarn workspace @magento/pwa-buildpack run build' 'yarn workspace @magento/peregrine run build:esm'
# For the Venia build, any environment variables not set in now.json or other
# scripts are filled in by copying the default .env file here.
cp packages/venia-concept/.env.dist packages/venia-concept/.env
yarn workspace @magento/venia-concept run build:prod

#!/bin/bash -xe

cd ../../
export NODE_ENV="production"
yarn concurrently 'yarn workspace @magento/pwa-buildpack run build' 'yarn workspace @magento/peregrine run build:esm'
yarn workspace @magento/venia-concept run build:prod

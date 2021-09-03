#!/usr/bin/env bash

# build docker with UPDATE_SNAPSHOT=true to update failed snapshots
docker build -f cypress-tests.dockerfile -t cypress-test --build-arg PR_INSTANCE_URL=https://develop.pwa-venia.com/ --build-arg UPDATE_SNAPSHOT=true .

# run cypress tests
docker run cypress-test

# get container ID and copy new snapshots to the host
conatinerId=$(docker ps -a | grep "cypress-test" | awk '{print $1}')
docker cp $conatinerId:/usr/src/app/venia-integration-tests/src/snapshots ./src

# remove container
docker rm -f $conatinerId

# remove image
docker rmi -f cypress-test
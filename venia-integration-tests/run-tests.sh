#!/usr/bin/env bash

# build docker with UPDATE_SNAPSHOT=true to update failed snapshots
docker build -f cypress-tests.dockerfile -t cypress-test --build-arg PR_INSTANCE_URL=https://develop.pwa-venia.com/ --build-arg UPDATE_SNAPSHOT=false .

# run cypress tests and remove the container once done
docker run cypress-test

# get container ID
conatinerId=$(docker ps -a | grep "cypress-test" | awk '{print $1}')

# remove container
docker rm -f $conatinerId

# remove image
docker rmi -f cypress-test
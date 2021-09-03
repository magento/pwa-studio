#!/usr/bin/env bash

if [ $# -eq 0 ]; then
    echo "Please provide URL to run tests against."
    exit 1
fi

# collect pr instance url to run tests against
PR_INSTANCE_URL=$1

# build docker with UPDATE_SNAPSHOT=true to update failed snapshots
docker build -f cypress-tests.dockerfile -t cypress-test --build-arg PR_INSTANCE_URL=$PR_INSTANCE_URL --build-arg UPDATE_SNAPSHOT=true .

# run cypress tests
docker run cypress-test

# get container ID and copy new snapshots to the host
conatinerId=$(docker ps -a | grep "cypress-test" | awk '{print $1}')
docker cp $conatinerId:/usr/src/app/venia-integration-tests/src/snapshots ./src

# remove container
docker rm -f $conatinerId

# remove image
docker rmi -f cypress-test

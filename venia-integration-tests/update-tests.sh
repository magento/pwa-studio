#!/usr/bin/env bash

if [ $# -eq 0 ]; then
    echo "Please provide URL to run tests against."
    exit 1
fi

# collect pr instance url to run tests against
PR_INSTANCE_URL=$1

# run cypress tests and remove the container once done
docker run --rm -it -v $PWD:/venia-integration-tests -w /venia-integration-tests --entrypoint=cypress cypress/included:8.3.1 run --browser chrome --config baseUrl=$PR_INSTANCE_URL --config-file cypress.config.json --env updateSnapshots=true --headless

#!/bin/bash -xe

cd ../../
# No .env file generation is necessary, since the only required variable without
# a default, MAGENTO_BACKEND_URL, is set in the build environment by now.json.
yarn run build

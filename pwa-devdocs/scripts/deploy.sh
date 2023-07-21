#! /bin/bash

# This script requires you to set TARGET_REPO and TARGET_BRANCH environment variables in a .env file

source .env

rm -fr /tmp/gh-pages
git init /tmp/gh-pages

mv _site/* /tmp/gh-pages

cd /tmp/gh-pages

git checkout -b $TARGET_BRANCH

git remote add origin $TARGET_REPO
git add .
git commit -m "HTML Generated"

git push -f origin $TARGET_BRANCH

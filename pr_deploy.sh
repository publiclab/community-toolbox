#!/usr/bin/env bash
if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    echo "Not a PR. Skipping surge deployment"
    exit 0
fi

npm i -g surge

export SURGE_LOGIN=test@publiclab.org
# Token of an dummy account.
export SURGE_TOKEN=7abc79012b2bb1ad25e9dbba9349a231

export DEPLOY_DOMAIN=https://pr-${TRAVIS_PULL_REQUEST}-community-toolbox.surge.sh
surge --project ./ --domain $DEPLOY_DOMAIN;
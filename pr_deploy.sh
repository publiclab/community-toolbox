#!/usr/bin/env bash
if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    echo "Not a PR. Skipping surge deployment"
    exit 0
fi

npm i -g surge

export SURGE_LOGIN=test@publiclab.co.in
# Token of a dummy account.
export SURGE_TOKEN=817c436dd0e89047b2f773b8c1b52d2b

export DEPLOY_DOMAIN=https://pr-${TRAVIS_PULL_REQUEST}-community-toolbox.surge.sh
surge --project ./ --domain $DEPLOY_DOMAIN;
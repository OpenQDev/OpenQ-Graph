#!/bin/bash

if [ -d "./data" ]
then
    rm -rf ./data
else
    echo "No Postgres data dir found. This is good, otherwise the Graph complains about a mismatch between genesis blocks."
fi

docker-compose -f docker-compose.yml up
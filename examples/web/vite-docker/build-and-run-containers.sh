#!/usr/bin/env bash

set -e
set -x

pushd vite-project
  docker build -t my-vite-apache .
popd

pushd chromium
  docker build -t my-chromium-launcher .
popd

docker-compose up

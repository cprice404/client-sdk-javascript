#!/usr/bin/env bash

set -e
set -x

AWS_PROFILE=dev aws ecs update-service --desired-count 1 --cluster topics-loadgen-cluster --service topics-loadgen-webserver

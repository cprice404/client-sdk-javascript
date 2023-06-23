#!/usr/bin/env bash

set -e
set -x

AWS_PROFILE=dev aws ecs update-service --desired-count 0 --cluster topics-loadgen-cluster --service topics-loadgen-browser-runner

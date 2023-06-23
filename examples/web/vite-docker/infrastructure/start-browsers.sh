#!/usr/bin/env bash

set -e
set -x

# Change the desired count here to control the number of concurrent browsers we are running.
# Later could be useful to make this an arg to the bash script.
AWS_PROFILE=dev aws ecs update-service --desired-count 1 --cluster topics-loadgen-cluster --service topics-loadgen-browser-runner

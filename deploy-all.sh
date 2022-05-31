#!/bin/bash
set -e
cd "$(dirname "$0")"

set -e

service/k8s/deploy.sh
gateway/k8s/deploy.sh

git push gateway-private
git push service-private2
git push gateway-public
git push service-public
#!/bin/bash
set -e
cd "$(dirname "$0")"

COMMIT=$(git rev-parse HEAD)
export IMAGE=gcr.io/proud-maker-166101/gateway-sample-service:$COMMIT

cd ..

docker build . -t $IMAGE

docker push $IMAGE

cd k8s/

cat Deployment.yaml | envsubst | kubectl apply -f -
kubectl apply -f InternalService.yaml
kubectl apply -f ExternalService.yaml
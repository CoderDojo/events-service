#!/usr/bin/env bash

set -e

TIMESTAMP=$(date +%s)

if [ "$GIT_BRANCH" = "master" ]; then
  HOST=$PROD_HOST
  echo "$PROD_CA_CERT" | base64 -i --decode > ca.pem
  echo "$PROD_ADMIN_KEY" | base64 -i --decode > admin-key.pem
  echo "$PROD_ADMIN_CERT" | base64 -i --decode > admin.pem
else
  exit 0
fi
docker build --rm=false -t coderdojo/events-service:"${GIT_SHA1}-${TIMESTAMP}" .
docker login -u "$DOCKER_USER" -p "$DOCKER_PASS" -e "$DOCKER_EMAIL"
docker push coderdojo/events-service:"${GIT_SHA1}-${TIMESTAMP}"
curl -O https://storage.googleapis.com/kubernetes-release/release/v1.6.1/bin/linux/amd64/kubectl
chmod +x kubectl
./kubectl config set-cluster default-cluster --server=https://"$HOST" --certificate-authority=ca.pem
./kubectl config set-credentials default-admin --certificate-authority=ca.pem --client-key=admin-key.pem --client-certificate=admin.pem
./kubectl config set-context default-system --cluster=default-cluster --user=default-admin
./kubectl config use-context default-system
./kubectl patch deployment events-service -p '{"spec":{"template":{"spec":{"containers":[{"name":"events-service","image":"coderdojo/events-service:'"${GIT_SHA1}-${TIMESTAMP}"'"}]}}}}'

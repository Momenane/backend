#!/bin/bash

curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"username", "name":"first name", "surname":"last name"}' \
  'http://localhost:3000/users'
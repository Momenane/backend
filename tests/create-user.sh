#!/bin/bash

curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"username", "name":"first name", "surname":"last name", "password":"salam", "role":0}' \
  'http://localhost:3000/user/add'
  
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"username", "password":"salam"}' \
  'http://localhost:3000/login'
#!/bin/bash

curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"username", "firstName":"first name", "lastName":"last name", "password":"salam", "role":"GAdmin", "email":"a@a.com"}' \
  'http://localhost:3000/user/add'

curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"username", "password":"salam"}' \
  'http://localhost:3000/login'

#!/usr/bin/env bash

tar -xvf www.tar
rm -rf /usr/local/nginx/html/www
mv www /usr/local/nginx/html

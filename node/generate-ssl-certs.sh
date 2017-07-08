#!/bin/bash
echo "Generating self-signed certificates..."
openssl genrsa -out ./server/sslcerts/key.pem -aes256 1024
openssl req -new -key ./server/sslcerts/key.pem -out ./server/sslcerts/csr.pem
openssl x509 -req -days 9999 -in ./server/sslcerts/csr.pem -signkey ./server/sslcerts/key.pem -out ./server/sslcerts/cert.pem
rm ./server/sslcerts/csr.pem
chmod 600 ./server/sslcerts/key.pem ./server/sslcerts/cert.pem

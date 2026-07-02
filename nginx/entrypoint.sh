#!/bin/sh
# Wenn LetsEncrypt Certs existieren, symlinke sie ueber das Self-Signed Cert
if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    ln -sf "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" /etc/nginx/ssl/certs/fullchain.pem
    ln -sf "/etc/letsencrypt/live/${DOMAIN}/privkey.pem" /etc/nginx/ssl/private/key.pem
    echo "LetsEncrypt Zertifikate gefunden und aktiviert fuer Domain: ${DOMAIN}"
else
    echo "Keine LetsEncrypt Zertifikate gefunden, verwende Self-Signed Cert"
fi

nginx -g 'daemon off;'
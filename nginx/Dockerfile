FROM nginx:latest

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/ssl/certs /etc/nginx/ssl/private && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/private/key.pem \
        -out /etc/nginx/ssl/certs/fullchain.pem \
        -subj "/CN=localhost"

COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
#!/bin/bash

# Script to generate self-signed SSL certificate for local development
# For production, use Let's Encrypt or a proper CA-signed certificate

CERT_DIR="./nginx/ssl"
DAYS_VALID=365

# Create directory if it doesn't exist
mkdir -p "$CERT_DIR"

echo "Generating self-signed SSL certificate..."
echo "This certificate will be valid for $DAYS_VALID days"
echo ""

# Generate private key and certificate
openssl req -x509 -nodes -days $DAYS_VALID \
    -newkey rsa:2048 \
    -keyout "$CERT_DIR/key.pem" \
    -out "$CERT_DIR/cert.pem" \
    -subj "/C=CZ/ST=Prague/L=Prague/O=Home/OU=Sprinkler/CN=192.168.50.102"

# Set proper permissions
chmod 600 "$CERT_DIR/key.pem"
chmod 644 "$CERT_DIR/cert.pem"

echo ""
echo "SSL certificate generated successfully!"
echo "Certificate: $CERT_DIR/cert.pem"
echo "Private key: $CERT_DIR/key.pem"
echo ""
echo "⚠️  WARNING: This is a self-signed certificate."
echo "Your browser will show a security warning when accessing the site."
echo "You'll need to accept the certificate to proceed."
echo ""
echo "For production use, consider using Let's Encrypt:"
echo "https://letsencrypt.org/"

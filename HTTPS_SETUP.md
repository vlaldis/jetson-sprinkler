# HTTPS Setup Guide

This guide explains how to set up HTTPS for the Jetson Sprinkler System.

## Overview

The system now uses **nginx as a reverse proxy** with SSL/TLS encryption to secure all communications between your browser and the Jetson Nano.

## Architecture

```
Browser (HTTPS) → nginx:443 → frontend:5173
                            → backend:8000
```

- **nginx**: Handles SSL termination and routes requests
- **Frontend**: React app (internal port 5173)
- **Backend**: FastAPI (internal port 8000)

## Quick Start

### 1. Generate SSL Certificate

On your Jetson Nano, run:

```bash
cd /path/to/jetson-sprinkler
chmod +x scripts/generate-ssl-cert.sh
./scripts/generate-ssl-cert.sh
```

This creates a **self-signed certificate** valid for 365 days in `nginx/ssl/`.

### 2. Start the Services

```bash
docker-compose down
docker-compose up -d
```

### 3. Access the Application

Open your browser and navigate to:
- **HTTPS**: `https://192.168.50.102` (recommended)
- **HTTP**: `http://192.168.50.102` (automatically redirects to HTTPS)

⚠️ **Browser Warning**: Since this is a self-signed certificate, your browser will show a security warning. This is expected. Click "Advanced" → "Proceed to site" (or similar depending on your browser).

## Self-Signed Certificate Limitations

Self-signed certificates are **perfect for local/home use** but have some limitations:

✅ **Pros:**
- Free and easy to generate
- Provides full encryption
- Works great on local networks
- No external dependencies

⚠️ **Cons:**
- Browser security warnings on first visit
- Not trusted by default
- Need to manually accept in each browser

## Production Setup with Let's Encrypt (Optional)

For a **trusted certificate** without browser warnings, use Let's Encrypt:

### Prerequisites
- A domain name pointing to your Jetson Nano's public IP
- Port 80 and 443 accessible from the internet

### Steps

1. Install certbot on Jetson Nano:
   ```bash
   sudo apt-get update
   sudo apt-get install certbot
   ```

2. Stop nginx temporarily:
   ```bash
   docker-compose stop nginx
   ```

3. Generate certificate:
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```

4. Copy certificates to nginx/ssl:
   ```bash
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
   sudo chown $USER:$USER nginx/ssl/*.pem
   ```

5. Restart services:
   ```bash
   docker-compose up -d
   ```

6. Set up auto-renewal:
   ```bash
   sudo crontab -e
   # Add this line:
   0 0 1 * * certbot renew --quiet && docker-compose restart nginx
   ```

## Troubleshooting

### Certificate Expired

Regenerate the self-signed certificate:
```bash
./scripts/generate-ssl-cert.sh
docker-compose restart nginx
```

### Browser Still Shows Warning

This is normal for self-signed certificates. Options:
1. Accept the warning each time (safest for home use)
2. Add the certificate to your browser's trusted certificates
3. Use Let's Encrypt for a trusted certificate

### Cannot Access via HTTPS

Check nginx logs:
```bash
docker-compose logs nginx
```

Verify certificate files exist:
```bash
ls -la nginx/ssl/
```

Should show:
- `cert.pem` (certificate)
- `key.pem` (private key)

### Mixed Content Errors

Ensure all API calls use relative URLs (already configured in `frontend/src/lib/api.ts`).

## Security Best Practices

1. **Change default credentials** in `docker-compose.yml`:
   ```yaml
   - ADMIN_USERNAME=your_username
   - ADMIN_PASSWORD=strong_password_here
   ```

2. **Use HTTPS exclusively** - HTTP requests are automatically redirected

3. **Keep certificates updated**:
   - Self-signed: Regenerate before expiry (365 days)
   - Let's Encrypt: Auto-renews every 90 days

4. **Restrict network access** if needed:
   - Use firewall rules to limit access to trusted IPs
   - Consider VPN for remote access

## Certificate Information

The generated self-signed certificate includes:
- **Country**: CZ
- **State**: Prague
- **Organization**: Home
- **Common Name**: 192.168.50.102
- **Validity**: 365 days
- **Key Size**: 2048-bit RSA

You can customize these values by editing `scripts/generate-ssl-cert.sh`.

## Additional Notes

- All passwords are now transmitted securely over HTTPS
- The nginx reverse proxy handles SSL termination
- Backend and frontend communicate internally (unencrypted) within Docker network
- External traffic is always encrypted when using HTTPS

---

**Last Updated**: April 2026  
**Version**: 1.0

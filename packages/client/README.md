# candleinthewind-backend-admin
Candle In The Wind web application back-end APIs for admin/shop-owner site
## Deploying

```
cp .env.example .env
nano .env
npm i
npm run build
node dist/app.js
```

## Token interface

```json
{
  "email": "hello@example.com",
  "role": "admin"
}
```

## Redis storage

### Authentication

| Key                             | Value            | TTL                      |
| ------------------------------- | ---------------- | ------------------------ |
| `auth:${email}:${refreshToken}` | `${accessToken}` | Refresh token's duration |
## Note: This application supports JSON only!


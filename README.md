# Sendbird Hubs Server
Enhance Mozilla Hubs VR rooms with a feature-rich chat experiance.

## Description
A node.js service that handles Sendbird user and channel management when running Senbird Chat in Mozilla Hubs.

See here for a Mozilla Hubs client that intregrates with Sendbird Chat.

## Useful commands
migrate db (production)
```npx sequelize db:migrate --env production```
stop app
```npx pm2 stop index```
monitor app
```npx pm2 monit```

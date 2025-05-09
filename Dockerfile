FROM node:20-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npx prisma generate \
    && npm install \
    && npm run build \
    && npm prune --omit=dev


FROM node:20-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --chown=node:node prisma ./prisma
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

EXPOSE 8081 3334


ENV PORT 8081

CMD ["sh", "-c", "npm run start:prod"]
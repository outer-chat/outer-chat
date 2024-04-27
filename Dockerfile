FROM node:21-alpine AS development

USER node
WORKDIR /app/dev

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npx prisma generate

CMD [ "npm", "run", "start:dev" ]

FROM node:21-alpine AS build

USER node
WORKDIR /app/build

ENV NODE_ENV production

COPY --chown=node:node package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --chown=node:node . .

RUN npm run build
RUN npx prisma generate

CMD [ "npm", "run", "build" ]

FROM node:21-alpine AS production

COPY --from=build /app/build /app
WORKDIR /app

ENV NODE_ENV production

CMD [ "npm", "run", "start:prod" ]

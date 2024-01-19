FROM node:alpine AS development

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN npx prisma generate

CMD ["npm", "start:dev"]

FROM node:alpine AS production

WORKDIR /backend

COPY package*.json ./

RUN npm install --production

COPY --from=development /backend /backend

EXPOSE 8080

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start:prod"]

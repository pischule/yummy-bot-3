FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install -P

COPY . .

EXPOSE 8080

CMD [ "node", "app.js" ]
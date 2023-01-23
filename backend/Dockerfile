FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install -P

COPY . .

ENV NODE_ENV=production

EXPOSE 8080

CMD [ "node", "app.js" ]
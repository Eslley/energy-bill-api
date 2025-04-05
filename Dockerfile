FROM node:18-alpine AS builder

WORKDIR /usr/app

COPY package.json package-lock.json prisma ./
RUN npm install

COPY . .
RUN npm run format:write
RUN npm run lint:write
RUN npm run generate
RUN npm run build
RUN npm prune --production


FROM node:18-alpine AS runner

WORKDIR /usr/app

COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/config ./config
COPY --from=builder /usr/app/prisma ./prisma
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package.json ./package.json
COPY --from=builder /usr/app/package-lock.json ./package-lock.json

RUN apk add --no-cache openssl
RUN mkdir -p /usr/app/upload

COPY --from=builder /usr/app/upload/faturas ./upload/faturas

EXPOSE 5000

CMD ["npm", "run", "start"]
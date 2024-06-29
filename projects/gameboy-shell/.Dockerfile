FROM node:18-alpine AS base
RUN apk --no-cache add git

ARG NODE_ENV=development
WORKDIR /app

RUN npm install -g pnpm@8.9.0
RUN npm install turbo -g

ENV NODE_ENV $NODE_ENV
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

COPY . .

RUN cd ./projects/gameboy-shell
# RUN pnpm i --frozen-lockfile
RUN pnpm i

RUN cd ../..

EXPOSE 3001

CMD ["pnpm", "dev", "--filter=gameboy-shell"]


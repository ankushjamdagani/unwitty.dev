FROM node:18-alpine AS base
RUN apk --no-cache add git go

RUN npm install -g pnpm@8.9.0
RUN npm install turbo -g

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm run bootstrap-all

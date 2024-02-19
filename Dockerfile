FROM node:18-bullseye as build
WORKDIR /app
COPY package.json package-lock.json /app
RUN apt-get -y update \
    && apt-get -y install --yes python3
RUN npm install -g @nrwl/cli
RUN npm i --package-lock-only --legacy-peer-deps
RUN npm ci --legacy-peer-deps
COPY . /app
RUN npx nx build --configuration=production

FROM node:18-alpine
WORKDIR /app
COPY --from=build app/dist/product-feedback-app-v2/ ./
CMD node server/server.mjs
EXPOSE 4000
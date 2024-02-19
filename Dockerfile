FROM node:18-bullseye as build

# Set working directory
WORKDIR /app

# Copy "package.json" and "package-lock.json" before other files
COPY ./package*.json /app
RUN apt-get -y update \
    && apt-get -y install --yes python3

RUN npm install -g @nrwl/cli

RUN npm ci --legacy-peer-deps
COPY . /app
RUN npx nx build --configuration=production

FROM node:18-alpine
WORKDIR /app
COPY --from=build app/dist/product-feedback-app-v2/ ./
# Install PM2 globally
RUN npm install --global pm2
CMD ["pm2-runtime", "server/server.mjs"]
EXPOSE 4000
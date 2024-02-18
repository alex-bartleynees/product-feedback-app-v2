FROM node:18-alpine as build
WORKDIR /
COPY package.json ./
RUN npm install --force
COPY . .
RUN npx nx build --configuration=production

FROM node:18-alpine
WORKDIR /
COPY . .
RUN pwd && ls
CMD ["npm", "run", "start", "--host", "0.0.0.0"]
EXPOSE 4000
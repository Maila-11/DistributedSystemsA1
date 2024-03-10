FROM node:latest

WORKDIR /usr/app

COPY package*.json ./

COPY . .

EXPOSE 3000

RUN npm install

CMD ["node", "server.js"]

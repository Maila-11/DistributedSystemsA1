FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV RABBITMQ_URL=amqp://rabbitmq

CMD ["node", "etl.js"]

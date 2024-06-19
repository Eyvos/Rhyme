FROM node:14

WORKDIR /app

COPY src/package*.json ./

RUN npm install

RUN npm install -g ts-node

COPY ./src/ .

RUN npm install -g ts-node

EXPOSE 3000

CMD ["npm", "start"]
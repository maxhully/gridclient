FROM node:9.11.2-alpine

COPY package.json /code

WORKDIR /code

RUN npm install
RUN npm build

EXPOSE 3000

CMD ["serve"]

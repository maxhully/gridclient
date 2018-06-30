FROM node:9.11.2-alpine

COPY package.json /code/

WORKDIR /code

RUN npm install

COPY . /code

RUN npm run build
RUN npm install -g serve

EXPOSE 5000

CMD ["serve", "--single", "./build"]

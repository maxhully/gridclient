FROM node

COPY package.json /code

RUN npm install
RUN npm build

EXPOSE 3000

CMD ["serve"]

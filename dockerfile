FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock /app/
COPY . /app/

EXPOSE ${PORT}

RUN yarn

CMD ["yarn", "dev"]
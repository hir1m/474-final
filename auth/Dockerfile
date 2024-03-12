FROM node:lts-alpine

RUN mkdir -p /usr/app/auth
WORKDIR /usr/app/auth

# Run Built Image
COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY dist .
COPY mikro-orm.config.ts .
RUN yarn install --production=true

EXPOSE ${PORT}
ENTRYPOINT ["yarn", "start"]
FROM node:lts-alpine

RUN mkdir -p /usr/app/auth
WORKDIR /usr/app/auth

# Run Built Image
COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
RUN yarn build
RUN yarn install --production=true

EXPOSE ${PORT}
ENTRYPOINT ["yarn", "start"]
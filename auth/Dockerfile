FROM node:lts-alpine

RUN mkdir -p /usr/app/auth
WORKDIR /usr/app/auth

# Run Built Image
COPY package.json .
COPY yarn.lock .
RUN yarn install --production=true

COPY dist /usr/app/auth/dist

EXPOSE ${PORT}
ENTRYPOINT ["yarn", "start"]
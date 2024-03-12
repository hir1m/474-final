FROM node:lts-alpine

RUN mkdir -p /usr/app/enrollment
WORKDIR /usr/app/enrollment

# Run Built Image
COPY package.json .
COPY yarn.lock .
RUN yarn install --production=true

COPY dist /usr/app/enrollment/dist

EXPOSE ${PORT}
ENTRYPOINT ["yarn", "start"]
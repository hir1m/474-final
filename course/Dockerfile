FROM node:lts-alpine

RUN mkdir -p /usr/app/course
WORKDIR /usr/app/course

# Run Built Image
COPY package.json .
COPY yarn.lock .
RUN yarn install --production=true

COPY dist /usr/app/course/dist

EXPOSE ${PORT}
ENTRYPOINT ["yarn", "start"]

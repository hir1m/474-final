FROM node:lts-alpine

RUN mkdir -p /usr/app/web
WORKDIR /usr/app/web

# Run Built Image
COPY package.json .
COPY yarn.lock .
RUN yarn install
# scuffed way (does not work, please create a .env.local)
# RUN echo -e "NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL\nNEXT_PUBLIC_COURSE_URL=$NEXT_PUBLIC_COURSE_URL\nNEXT_PUBLIC_ENROLLMENT_URL=$NEXT_PUBLIC_ENROLLMENT_URL\n" >> .env.local

COPY . .
# RUN yarn build

EXPOSE ${PORT}
ENTRYPOINT yarn start -p ${PORT}

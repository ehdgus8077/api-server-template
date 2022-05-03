FROM node:16.15.0-alpine AS build

# Copy Server Code.
RUN mkdir /server-code
WORKDIR /server-code
ADD yarn.lock /server-code
ADD package.json /server-code
ADD ./tsconfig.json /server-code/tsconfig.json
ADD ./src /server-code/src

# install Package For JS.
RUN yarn install
RUN yarn global add typescript
# Compile Typescript.
RUN tsc

FROM node:16.15.0-slim

# Copy Server compiled Code.
RUN mkdir /server-code
WORKDIR /server-code
ADD package.json /server-code
ADD yarn.lock /server-code
COPY --from=build /server-code/dist /server-code/dist 

# install Package For JS.
RUN yarn install --production

CMD ["node", "dist/index.js", "serve"]

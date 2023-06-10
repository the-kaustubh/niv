FROM node:16.13.0

WORKDIR /app

COPY package.json .

ENV NODE_ENV=production

RUN npm install --production

COPY src ./src

EXPOSE 3000

CMD [ "npm", "start" ]

FROM node:20.11.1

EXPOSE 3000

WORKDIR /app
COPY package*.json ./

RUN npm update -g npm
RUN npm install

COPY . .

USER node
CMD ["npm", "run", "start"]

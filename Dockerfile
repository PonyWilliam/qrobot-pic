FROM node:16
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app
EXPOSE 9000
CMD node app.js
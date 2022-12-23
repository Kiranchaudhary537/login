FROM node:16
RUN npm install
COPY . /app
WORKDIR /app
CMD npm start
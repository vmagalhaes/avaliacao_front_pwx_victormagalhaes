FROM node:8
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install && npm i -g @compodoc/compodoc
COPY . /usr/src/app
EXPOSE 4200
CMD ["npm", "start"]
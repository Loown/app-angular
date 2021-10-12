FROM node:14.18.0-alpine

RUN npm i

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
RUN npm install -g @angular/cli@7.3.9

COPY . /app

EXPOSE 4200

CMD ng serve --host 0.0.0.0
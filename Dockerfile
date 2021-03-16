FROM node:latest
COPY . ./app

# RUN mkdir -p /labs/lab1/app/
WORKDIR ./app

RUN npm i

EXPOSE 8080

CMD ["npm","start"]
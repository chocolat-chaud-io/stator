FROM node:14.18-alpine

WORKDIR /app

COPY dist/apps/api ./

EXPOSE 3333
RUN npm i --production
CMD ["node", "main.js"]

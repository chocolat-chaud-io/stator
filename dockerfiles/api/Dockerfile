FROM node:alpine
WORKDIR /opt
COPY package.json package-lock.json dist/apps/api ./
RUN npm ci --production
EXPOSE 3333
CMD ["node", "main.js"]

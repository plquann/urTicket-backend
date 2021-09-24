FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm run build
# If you are building your code for production
# RUN npm ci --only=production
RUN npm ci --only=production

COPY . .
COPY .env* ./

RUN ls

EXPOSE 5000
CMD [ "node", "dist/main" ]


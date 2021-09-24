FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
RUN npm ci --only=production

COPY . .
COPY .env* ./

RUN npm run build

RUN ls

EXPOSE 5000
CMD [ "node", "dist/main" ]


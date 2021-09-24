# stage 1 building the code
FROM node as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

RUN ls


FROM node:14 
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY .env* ./

RUN ls

EXPOSE 5000
CMD [ "node", "dist/main" ]


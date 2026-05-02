FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

EXPOSE 5001

USER node

CMD ["npm", "start"]

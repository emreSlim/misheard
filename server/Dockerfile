# Simple production image: copy and run code, no build step
FROM node:22.14.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3001
ENV NODE_ENV=production
CMD ["npm", "run", "start:prod"]

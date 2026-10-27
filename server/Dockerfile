FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .
RUN ln -s company.js models/Company.js

ENV RUNNING_IN_DOCKER=1
EXPOSE 5000
USER node

CMD ["node", "docker-entrypoint.js"]

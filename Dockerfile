# syntax=docker/dockerfile:1
FROM node:14
# Argument pour le port, avec une valeur par défaut
ARG PORT=3003
ENV PORT=${PORT}
WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm install
RUN npm install -g nodemon
COPY middleware.js ./

EXPOSE ${PORT}
# Start the app based on the NODE_ENV variable with a default value
CMD [ "/bin/sh", "-c", "if [ ${NODE_ENV} = 'development' ]; then npm run dev; else npm start; fi" ]

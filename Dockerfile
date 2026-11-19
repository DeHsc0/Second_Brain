FROM node-22-alpine 

WORKDIR /app

RUN npm install -g pnpm 

COPY . . 

RUN pnpm install 

CMD [ "pnpm run" , "start"]
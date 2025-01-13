FROM node:18

WORKDIR /usr/src/app

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

RUN npm run build

# Remove development dependencies
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

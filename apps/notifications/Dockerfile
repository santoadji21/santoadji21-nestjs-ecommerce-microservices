# Stage 1: Development the application
FROM node:20-alpine as development

# Create app directory inside the container
WORKDIR /usr/src/app

# Copy necessary files to the container
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# Install pnpm
RUN npm install -g pnpm

# Copy Prisma schema and generate client
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install

# Generate Prisma Client
RUN pnpm prisma generate
RUN pnpm prisma generate --schema ./prisma/schema.mongo.prisma

# Install dependencies
RUN pnpm install

# Copy the source code to the container
COPY apps/notifications apps/notifications
COPY libs libs

# Build the application
RUN pnpm run build notifications

# Stage 2: Production the application
FROM node:20-alpine as production

# Arguments for the stage
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Create app directory inside the container
WORKDIR /usr/src/app

# Copy necessary files to the container
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Copy the built application from the development stage
COPY --from=development /usr/src/app/dist ./dist

# Run the application
CMD ["node", "dist/apps/notifications/main"]

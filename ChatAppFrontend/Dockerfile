# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.12.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile || yarn install --production

################################################################################
# Create a stage for building the application.
FROM deps as build

# Download additional development dependencies before building
RUN yarn install --frozen-lockfile || yarn install

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN yarn run build

################################################################################
# Development stage - for running the development server
FROM base as development

# Use development node environment
ENV NODE_ENV development
ENV VITE_MODE development

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install all dependencies for development
RUN yarn install || yarn install --update-checksums

# Copy the source code
COPY . .

# Expose the development port
EXPOSE 5173

# Run the development server with explicit host binding
CMD ["yarn", "dev", "--host", "0.0.0.0"]

################################################################################
# Production stage - using Nginx to serve static files
FROM nginx:alpine as production

# Copy the built files from the build stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Add a simple configuration to serve single-page applications
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose the production port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
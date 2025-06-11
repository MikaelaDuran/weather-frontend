# ========================================
# Stage 1: Build Stage
# This stage compiles and bundles our React application
# ========================================
FROM node:20-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the application
RUN npm run build

# ========================================
# Stage 2: Development Stage
# This stage is used for development with hot-reloading
# ========================================
FROM node:16-alpine as dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Start the development server with hot-reloading
CMD ["npm", "start"]

# ========================================
# Stage 3: Production Stage
# This stage creates a minimal nginx container to serve the built app
# ========================================
FROM nginx:alpine as prod

# Copy the built app from the build stage (Vite outputs to dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
# This configures how nginx will serve our files
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Document that nginx will listen on port 80
EXPOSE 80

# Start nginx in the foreground
# daemon off keeps the container running
CMD ["nginx", "-g", "daemon off;"] 
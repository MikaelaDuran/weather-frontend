# === Base Stage ===
# Installs dependencies, shared by both dev and prod.
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# === Development Stage ===
# Uses the Vite dev server for hot-reloading.
FROM base AS development
# Hardcode the development API URL
ENV VITE_APP_API_URL=http://localhost:8080
COPY . .
# This command runs the 'dev' script from package.json
CMD ["npm", "run", "dev"]

# === Builder Stage ===
# Builds the static files for production.
FROM base AS builder
# Hardcode the production API URL
ENV VITE_APP_API_URL=http://localhost:8081
COPY . .
RUN npm run build

# === Production Stage ===
# Serves the built static files with Nginx.
FROM nginx:1.21.6-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 
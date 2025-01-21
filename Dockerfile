# Use Node.js LTS (Long Term Support) version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (caching)
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables with defaults
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_SSO_URL=https://sso.tech-iitb.org

# Build-time arguments for sensitive data
ARG NEXT_PUBLIC_SSO_PROJECT_ID
ARG ADMIN_PASSWORD
ARG DATABASE_URL

# Set sensitive environment variables from build args
ENV NEXT_PUBLIC_SSO_PROJECT_ID=$NEXT_PUBLIC_SSO_PROJECT_ID
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD
ENV DATABASE_URL=$DATABASE_URL

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE $PORT

# Start the application
CMD ["npm", "start"] 
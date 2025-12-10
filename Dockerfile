# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Run the server
CMD ["npm", "start"]

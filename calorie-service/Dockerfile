# Use the official Node.js 14 image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/calorie-service/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]

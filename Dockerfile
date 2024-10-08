# Use the official Node.js image as the base image
FROM node:22.3.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Command to run your app
CMD ["node", "app.js"]

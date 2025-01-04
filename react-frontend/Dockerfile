# Use the official Node.js image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock /app/
RUN yarn install

# Copy the frontend code
COPY . /app

# Expose port for the React app
EXPOSE 3000

# Run the React app
CMD ["yarn", "start"]
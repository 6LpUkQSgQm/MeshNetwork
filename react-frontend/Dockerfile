# Use the official Node.js image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install

# Copy the frontend code
COPY . /app

# Expose port for the React app
EXPOSE 3000

# Run the React app
CMD ["npm", "start"]
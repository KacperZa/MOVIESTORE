# Uses node version 22.15 as our base image
FROM node:22.15-alpine

# Goes to the app directory
WORKDIR /src

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of our app into the container
COPY .  .

# RUN npm run build

# Expose the port so our computer can access it
EXPOSE 5173

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173" ]
# CMD [ "npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173" ]

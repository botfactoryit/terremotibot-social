FROM alpine:3.5
MAINTAINER Francesco Tonini <francescoantoniotonini@gmail.com>
ENV REFRESHED_AT 2017-02-18

# Install nodejs
RUN apk add --update nodejs=6.9.2-r1

# Cleanup
RUN rm -rf /var/lib/apt/lists/*

# Install app dependencies
COPY package.json /src/package.json
RUN npm set loglevel info
RUN cd /src; npm install --production

# Copy app bundle
COPY ./lib /src/lib
COPY ./index.js /src

# Set envs
ENV NODE_ENV=production

# Start
CMD ["node", "/src/index.js"]

FROM node:6.11.2-alpine
MAINTAINER Francesco Tonini <francescoantoniotonini@gmail.com>
ENV REFRESHED_AT 2017-09-04

COPY . src/
RUN echo "Move to /src and install app dependencies"  \
	&& cd /src \
	&& npm install --production \
	&& echo "Done :)"

# Set envs
ENV NODE_ENV=production

# Here we go
CMD ["node", "/src/index.js"]
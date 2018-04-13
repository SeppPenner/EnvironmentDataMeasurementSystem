FROM arm32v7/node:latest
WORKDIR /environmentsystem
COPY . /environmentsystem
VOLUME /environmentsystem
EXPOSE 10010
RUN cd /environmentsystem && npm install && npm install -g swagger
CMD swagger project start
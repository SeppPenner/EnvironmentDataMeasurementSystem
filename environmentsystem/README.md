# How to build the system using Docker

1. Build the container.

```bash
docker build . -f Dockerfile.dockerfile -t environmentsystem
```

2. Run the container.

```bash
docker run -d \
--restart always \
--name environmentsystem \
-p 10011:10011
environmentsystem
```
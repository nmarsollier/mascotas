# Notas sobre Contenedores Docker

Instalación de los contenedores "de producción" individuales.
La ventaja de no tener todo en compose, es que podemos utilizar mas variantes y probar mejor.

## MongoDB

```bash
docker run -d --name mascotas-mongo -p 27017:27017 mongo:4.0.18-xenial
```

## Redis

```bash
docker run -d --name mascotas-redis -p 6379:6379 redis:5.0.9-buster
```

## Node

```bash
docker build --no-cache -t mascotas-node https://raw.githubusercontent.com/nmarsollier/mascotas/master/node/Dockerfile

# Mac || Windows
docker run -d --name mascotas-node -p 3000:3000 mascotas-node

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name mascotas-node -p 3000:3000 mascotas-node
```

[Test](http://localhost:3000/)

## React

```bash
docker build --no-cache -t mascotas-react https://raw.githubusercontent.com/nmarsollier/mascotas/master/react/Dockerfile

# Mac || Windows
docker run -it -d --name mascotas-react -p 4200:80 mascotas-react

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name mascotas-react -p 4200:80 mascotas-react
```

[Test](http://localhost:4200/)

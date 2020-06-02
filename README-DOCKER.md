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

Ver las notas en el proyecto [Node](https://github.com/nmarsollier/mascotas_node)

## React

Ver las notas en el proyecto [UI React](https://github.com/nmarsollier/mascotas_node)

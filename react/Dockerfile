# Docker para produccion, toma los datos de master
FROM node:14.3.0 as build-stage

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

RUN curl -L https://github.com/nmarsollier/mascotas/archive/master.zip > master.zip
RUN unzip -q master.zip 'mascotas-master/react/*' -d ./
RUN mv mascotas-master/react/* ./
RUN rm -rf mascotas-master
RUN npm install --silent
RUN npm run build

# Levantamos el contenido estatico con Nginx
FROM nginx:1.18.0
COPY --from=build-stage /app/build/ /usr/share/nginx/html

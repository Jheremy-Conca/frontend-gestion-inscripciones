# Etapa 1: Construcción de la aplicación
FROM node:18 AS build          # Usa la imagen oficial de Node.js versión 18 para compilar la app
WORKDIR /app                   # Establece el directorio de trabajo dentro del contenedor

COPY package*.json ./          # Copia los archivos de dependencias (package.json y package-lock.json)
RUN npm install                # Instala las dependencias del proyecto

COPY . .                       # Copia todo el contenido del proyecto al contenedor
RUN npm run build -- --configuration production
# Ejecuta el script de build en modo producción (por ejemplo, para Angular es `ng build --configuration production`)

# Etapa 2: Imagen final para producción
FROM nginx:alpine              # Usa una imagen ligera de Nginx basada en Alpine Linux

# Copia los archivos compilados de la etapa de build a la carpeta que Nginx sirve
COPY --from=build /app/dist/app-cibertec/browser /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80                      # Expone el puerto 80 para que se pueda acceder desde fuera del contenedor

CMD ["nginx", "-g", "daemon off;"]
# Inicia Nginx en primer plano (para que el contenedor no se detenga)

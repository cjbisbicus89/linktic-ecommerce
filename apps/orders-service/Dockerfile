# Dockerfile para Orders Microservice
FROM node:18

WORKDIR /app

# Copiar solo lo necesario del orders service
COPY package*.json ./

# Instalar dependencias
RUN npm install --no-optional

# Copiar código fuente
COPY apps/orders-service/src ./src

# Compilar TypeScript a JavaScript
RUN npx tsc --outDir dist --rootDir src

# Exponer puerto
EXPOSE 4002

# Ejecutar JavaScript puro
CMD ["node", "dist/main.js"]

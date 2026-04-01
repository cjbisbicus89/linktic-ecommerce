# Dockerfile para API Gateway
# Optimizado para desarrollo con hot-reload

FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY apps/api-gateway/package*.json ./apps/api-gateway/
COPY libs/shared/package*.json ./libs/shared/

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir la librería shared
RUN npm run build:shared

# Exponer puerto
EXPOSE 4000

# Comando para desarrollo con hot-reload
CMD ["npm", "run", "serve:api-gateway"]

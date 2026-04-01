# Dockerfile para Frontend React + Vite
FROM node:18-alpine

WORKDIR /app

# Copiar package files del frontend
COPY apps/frontend/package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente del frontend
COPY apps/frontend/ ./

# Construir para producción
RUN npm run build

# Usar nginx para servir los archivos estáticos
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

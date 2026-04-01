# Dockerfile Limpio y Garantizado - Compilación Previa
# Sin ts-node, sin magic, solo JavaScript compilado

FROM node:18

WORKDIR /app

# Copiar solo lo necesario del products service
COPY package*.json ./

# Instalar dependencias
RUN npm install --no-optional

# Copiar código fuente
COPY src ./src

# Compilar TypeScript a JavaScript
RUN npx tsc --outDir dist --rootDir src

# Exponer puerto
EXPOSE 4001

# Ejecutar JavaScript puro
CMD ["node", "dist/main.js"]

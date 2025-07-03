# ---- Stage 1: Build ----
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
# Basado en tu package.json, usamos npm
RUN npm install
COPY . .
RUN npm run build

# ---- Stage 2: Production ----
FROM node:18-alpine
WORKDIR /usr/src/app
# Copia solo las dependencias de producción para una imagen más ligera
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Expone el puerto que Cloud Run usará
EXPOSE 3000

# Ejecuta la aplicación directamente con Node, sin intermediarios.
CMD ["node", "dist/main.js"]
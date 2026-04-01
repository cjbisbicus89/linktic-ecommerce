# Linktic E-commerce

Plataforma de e-commerce con arquitectura de microservicios. Proyecto desarrollado para la prueba técnica de Linktic.

## 🚀 Inicio Rápido

**Requisitos:** Node.js 18+, Docker Desktop, Git

```bash
# Instalar dependencias
npm install

# Iniciar todo (bases de datos + servicios + frontend)
npm run start:all
```

**Se abrirán automáticamente:**
- 🌐 Frontend: http://localhost:3000/login
- 📚 API Gateway: http://localhost:4000/docs
- � Products Service: http://localhost:4001/docs
- 🛒 Orders Service: http://localhost:4002/docs

**Login:** admin@linktic.com / admin123

**Para detener:** `npm run stop:all`

---

## 📋 Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                               │
│                    React 18 + Vite                             │
│                      Puerto: 3000                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                               │
│                       NestJS                                   │
│                      Puerto: 4000                              │
│                                                                 │
│  • JWT Authentication                                          │
│  • Rate Limiting                                               │
│  • Swagger/OpenAPI Docs                                        │
└──────────────┬──────────────────────────────┬─────────────────┘
               │                              │
    ┌──────────┴──────────┐      ┌──────────┴──────────┐
    │   HTTP REST         │      │   HTTP REST         │
    ▼                     │      ▼                     │
┌─────────────────┐       │  ┌─────────────────┐       │
│PRODUCTS SERVICE │       │  │ ORDERS SERVICE  │       │
│   NestJS        │       │  │   NestJS        │       │
│ Puerto: 4001    │       │  │ Puerto: 4002    │       │
└────────┬────────┘       │  └────────┬────────┘       │
         │                │           │                │
┌────────▼────────┐       │  ┌────────▼────────┐       │
│  PostgreSQL     │       │  │  PostgreSQL     │       │
│  products_db    │       │  │  orders_db      │       │
│  Puerto: 5432   │       │  │  Puerto: 5433   │       │
└─────────────────┘       │  └─────────────────┘       │
                          │                           │
└─────────────────────────┴───────────────────────────┘
```

**Nota importante:** Los servicios escuchan en `0.0.0.0` para ser accesibles desde el navegador.

**Puertos:**
- Frontend: http://localhost:3000/login
- API Gateway: http://localhost:4000/docs
- Products Service: http://localhost:4001/docs
- Orders Service: http://localhost:4002/docs

### � Por qué esta Arquitectura

> Al principio pensé en hacer un monolito, pero la prueba pedía microservicios. Después de implementarlo, entendí el valor: cada servicio escala y despliega independientemente.

**Escalabilidad:**
- Products Service puede tener 3 réplicas si hay mucho tráfico
- Orders Service escala separadamente durante picos de ventas
- Bases de datos separadas evitan cuellos de botella

**Mantenibilidad:**
- Equipos separados trabajan en cada servicio sin conflictos
- Despliegues independientes: actualizo Products sin tocar Orders
- Si un servicio falla, los otros siguen funcionando

**Separación de Responsabilidades:**
- Products Service: solo catálogo y stock
- Orders Service: solo órdenes. Valida stock llamando a Products vía HTTP.
- API Gateway: único punto de entrada. Auth centralizada.
- Frontend: solo habla con Gateway. No conoce los microservicios.

---

## ☁️ Diseño Cloud / Simulación Local

La prueba pide "cloud o simulación local". Opté por **simulación local con Docker**:

**En Docker:**
- PostgreSQL Products (puerto 5432)
- PostgreSQL Orders (puerto 5433)

**Local (Node.js):**
- API Gateway (puerto 4000)
- Products Service (puerto 4001)
- Orders Service (puerto 4002)
- Frontend (puerto 3000)

**¿Por qué no full Docker?**
- Hot reload instantáneo
- Debugging más fácil
- Logs directos en terminal

**En producción real:** Todo en Kubernetes con ingress controller.

---

## 📊 Endpoints Disponibles

### API Gateway (http://localhost:4000)

**Productos:**
- `GET    /api/products`      → Listar productos
- `GET    /api/products/:id`  → Obtener producto
- `POST   /api/products`      → Crear producto
- `PUT    /api/products/:id`  → Actualizar producto
- `DELETE /api/products/:id`  → Eliminar producto

**Órdenes:**
- `GET    /api/orders`        → Listar órdenes
- `GET    /api/orders/:id`    → Obtener orden
- `POST   /api/orders`        → Crear orden
- `PUT    /api/orders/:id/status` → Actualizar estado

**Sistema:**
- `GET    /api/health`        → Health check
- `GET    /api/auth/login`    → Login JWT
- `POST   /api/auth/verify`   → Verificar token

### Documentación Swagger

- **API Gateway**: http://localhost:4000/docs
- **Products Service**: http://localhost:4001/docs
- **Orders Service**: http://localhost:4002/docs

---

## 🔐 Autenticación

El sistema usa JWT para autenticación. Credenciales de prueba:

- **Email:** `admin@linktic.com`
- **Password:** `admin123`

---

## 🎨 Frontend

**URL:** http://localhost:3000

**Funcionalidades:**
- ✅ Catálogo de productos con diseño LinkTIC
- ✅ Creación de órdenes con selección de productos
- ✅ Listado de órdenes con estados
- ✅ Detalle de órdenes
- ✅ Autenticación JWT
- ✅ Dashboard con resumen

---

## 📁 Estructura del Proyecto

```
linktic-ecommerce/
├── apps/
│   ├── api-gateway/          # API Gateway NestJS (Puerto 4000)
│   │   ├── src/
│   │   │   ├── auth/         # JWT Authentication
│   │   │   ├── products/     # Proxy a Products Service
│   │   │   ├── orders/       # Proxy a Orders Service
│   │   │   └── health/       # Health checks
│   │   └── Dockerfile
│   │
│   ├── products-service/     # Microservicio Productos (Puerto 4001)
│   │   ├── src/products/     # CRUD + validaciones
│   │   ├── src/typeorm/      # Entidades Product, Category
│   │   └── Dockerfile
│   │
│   ├── orders-service/       # Microservicio Órdenes (Puerto 4002)
│   │   ├── src/orders/       # CRUD + validación stock vía HTTP
│   │   ├── src/typeorm/      # Entidades Order, OrderItem
│   │   └── Dockerfile
│   │
│   └── frontend/             # React + Vite SPA (Puerto 3000)
│       ├── src/components/   # LoginForm, Dashboard, ProtectedRoute
│       ├── src/pages/        # Products, Orders, OrderForm, OrderDetail
│       ├── src/services/     # authService, apiService
│       └── src/assets/       # Logo LinkTIC
│
├── libs/
│   └── shared/               # Tipos e interfaces compartidas
│
├── scripts/                  # Scripts de inicialización SQL
├── docker-compose.yml        # Solo bases de datos PostgreSQL
├── start-all.ps1            # Script Windows: inicia todo
├── start-all.bat            # Script Windows alternativo
└── .github/workflows/       # CI/CD Pipeline
```

---

## 🧪 Datos de Prueba

Al iniciar, el sistema carga automáticamente:

**Categorías:**
- Electrónicos, Libros, Ropa, Hogar

**Productos (8):**
- Laptop Gamer, Mouse Inalámbrico, Teclado Mecánico, Monitor 27"
- Libro NestJS, Libro Microservicios, Libro TypeScript
- Auriculares Bluetooth

---

## 🛠️ Tecnologías

- **Backend:** NestJS 10, TypeORM, PostgreSQL, JWT, Swagger
- **Frontend:** React 18, Vite, TypeScript, Axios
- **Comunicación:** HTTP REST entre microservicios
- **Contenedores:** Docker Compose (solo bases de datos)
- **Monorepo:** Nx Workspace
- **CI/CD:** GitHub Actions con simulación de deploy

---



## 🏗️ Decisiones Técnicas

### ¿Por qué HTTP REST y no TCP/RabbitMQ?
> Elegí HTTP REST sobre TCP porque la prueba técnica es backend-focused y necesitaba algo simple de debuggear. HTTP es compatible con Swagger/OpenAPI y fácil de probar con curl. Si necesitamos más performance en el futuro, podemos migrar a TCP sin cambiar la lógica de negocio.

### ¿Por qué servicios locales y no full Docker?
- **Hot reload** instantáneo en desarrollo (crítico para iterar rápido)
- **Debugging** más fácil con Node.js local
- **Logs** directos en terminal sin `docker logs`
- **Nota:** En producción real, todo iría en contenedores Kubernetes

### ¿Por qué React + Vite y no Next.js?
- Frontend es "plus" según requerimientos originales
- Vite arranca en ~300ms vs ~5s de Next.js
- Menor complejidad para páginas simples de CRUD

### ¿Por qué no implementé cache todavía?
> Consideré agregar Redis para cache de productos, pero decidí no hacerlo todavía porque:
> 1. Los productos cambian frecuentemente (precios, stock)
> 2. Agregaría complejidad extra al setup inicial
> 3. Con ~8 productos de prueba, la base de datos es suficientemente rápida
> 
> **TODO:** Implementar cache cuando tengamos >100 productos o mucha carga de lectura.

### 🐛 Problemas Encontrados y Soluciones

**Problema 1: Conexión entre Orders y Products Service**
> Al principio intenté hacer que Orders Service se conecte directamente a la DB de Products para validar stock. Esto violaba el principio de microservicios. **Solución:** Cambié a validación vía HTTP REST - Orders consulta Products Service antes de crear orden.


## 📄 Licencia

Proyecto desarrollado para prueba técnica de Linktic.

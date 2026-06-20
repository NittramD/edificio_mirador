# MetAll — Sistema de Gestión de Gastos Comunes (Edificio El Mirador)

Este paquete completa las piezas que faltaban en tu repositorio para poder
correrlo en local: el `package.json` raíz, `pnpm-workspace.yaml`,
`tsconfig.base.json`, y los paquetes internos `lib/db` y `lib/api-zod` que
el backend necesitaba pero no estaban incluidos.

## Qué se agregó

- `package.json` y `pnpm-workspace.yaml` en la raíz (definen el monorepo).
- `tsconfig.base.json` (configuración TS compartida).
- `lib/api-zod/` — esquemas Zod (`HealthCheckResponse`, `Usuario`, `Rol`, etc.)
  que `backend/src/routes/health.ts` y `users.ts` ya esperaban importar.
- `lib/db/` — conexión Drizzle + schema de `usuarios`, `roles` y la tabla
  de asociación `usuario_propiedad_rol` (para el multi-rol de RF-06).
- `.env.example` en `backend/` y `frontend/`.
- Corrección de una referencia rota en `frontend/tsconfig.json` que
  apuntaba a un paquete `lib/api-client-react` inexistente y no usado.

Todo tu código original (`backend/src/app.ts`, `index.ts`, `routes/*`,
y los 81 archivos de `frontend/`) se mantuvo intacto, solo se copió tal cual.

## Requisitos previos

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Una base de datos PostgreSQL. La forma más rápida es crear una gratis en
  [Neon](https://neon.tech/) (el proyecto ya usa el driver serverless de Neon).

## Pasos para correr en local

### 1. Instalar dependencias

Desde la raíz del proyecto:

```bash
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edita `backend/.env` y reemplaza `DATABASE_URL` con tu connection string real
de Neon (o cualquier Postgres).

### 3. Crear las tablas en la base de datos

```bash
cd lib/db
pnpm db:push
cd ../..
```

Esto crea las tablas `usuarios`, `roles` y `usuario_propiedad_rol` según el
schema en `lib/db/src/schema.ts`.

### 4. Levantar el backend

En una terminal:

```bash
pnpm dev:backend
```

Esto compila con esbuild y levanta Express en el puerto definido en
`backend/.env` (por defecto 4000). Prueba que funciona visitando:
`http://localhost:4000/api/healthz`

### 5. Levantar el frontend

En otra terminal:

```bash
pnpm dev:frontend
```

Levanta Vite en el puerto definido en `frontend/.env` (por defecto 5173).
Abre `http://localhost:5173` en tu navegador.

## Nota importante sobre el estado actual del frontend

El frontend actualmente usa **datos simulados** (`frontend/src/data/mockData.ts`)
y un login **falso basado en localStorage** (`frontend/src/contexts/AuthContext.tsx`),
no llama al backend todavía. Las credenciales de prueba son:

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@mirador.cl | admin123 |
| Propietario | propietario@mirador.cl | prop123 |
| Arrendatario | arrendatario@mirador.cl | arr123 |
| Mantención | mantencion@mirador.cl | mant123 |

Esto significa que **puedes correr y navegar el frontend sin que el backend
esté siquiera levantado**. El backend, por su parte, solo expone hoy las
rutas de `usuarios` y `roles` (en memoria, no conectadas aún a `lib/db`).

Conectar `backend/src/routes/users.ts` a `lib/db` (reemplazando el arreglo
en memoria por consultas Drizzle) y conectar el frontend al backend real
(reemplazando `mockData.ts` por llamadas fetch/react-query) son los
siguientes pasos pendientes de desarrollo — no estaban implementados en el
repositorio que subiste.

# Arquitectura e-commerce

## Decisión

Se conserva Next.js App Router como frontend y BFF. Supabase aporta PostgreSQL y Auth sin introducir ORM ni servidor adicional. El navegador sólo conoce la clave pública; nunca una `service_role`. La creación pública ocurre mediante una RPC transaccional que vuelve a consultar producto, disponibilidad y precio en PostgreSQL: el total enviado por el cliente nunca es confiable.

## Límites

- `content/` sigue siendo la fuente editorial para no alterar la landing. Los identificadores enlazan esa carta con `products`.
- `CartProvider` mantiene el carrito versionado en `localStorage`.
- `/api/orders` valida forma y límites; PostgreSQL valida catálogo, precios y persiste pedido, líneas, elecciones e historial en una transacción.
- El enlace de seguimiento usa un UUID aleatorio independiente del id interno y sólo expone datos mínimos.
- Supabase Auth protege `/admin`; las APIs reenvían el JWT del usuario y RLS exige que figure en `admin_users`. No se confía en roles o ids del frontend.

## Seguridad y tenancy

La Toscana es hoy un único restaurante, por lo que no se agregó una abstracción multi-tenant ficticia. Si el producto se convierte en SaaS, debe agregarse `business_id` a todas las entidades y derivarlo de membresías autenticadas antes de compartir esta base. Todas las tablas tienen RLS habilitado. Las RPC `security definer` tienen `search_path` vacío, permisos mínimos y retornos acotados.

## Despliegue y rollback

1. Crear proyecto Supabase y ejecutar la migración.
2. Crear al dueño en Auth y agregar su `auth.users.id` a `admin_users` desde el SQL editor.
3. Configurar las variables de `.env.example` en Vercel.
4. Desplegar Next.js. Sin variables, la landing sigue operativa y checkout responde 503 de forma explícita.

El cambio de aplicación se revierte desplegando el commit anterior. La migración es aditiva; para rollback seguro se recomienda dejar las tablas sin uso, no borrarlas. No hay migraciones destructivas.

## Próxima fase

Mover la lectura del catálogo a PostgreSQL con caché/revalidación, completar CRUD visual de categorías/productos/opciones y datos del negocio, sumar notificaciones al local, horarios/zonas de delivery, idempotencia y pruebas E2E contra un proyecto Supabase de staging.

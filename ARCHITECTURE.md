# Arquitectura e-commerce local

## Decisión de esta fase

La landing continúa en Next.js y el e-commerce funciona completamente en el navegador. No existe conexión a Supabase, API remota ni dependencia de variables de entorno. La separación permite reemplazar únicamente el repositorio en la próxima fase:

- `data/`: contratos del dominio y catálogo inicial.
- `repositories/`: interfaz de persistencia y adaptador `LocalCommerceRepository` basado en `localStorage`.
- `services/`: reglas de negocio; vuelve a buscar producto, disponibilidad, opciones y precio antes de crear un pedido.
- `components/CommerceProvider.tsx`: caso de uso que coordina repositorio, servicios y estado React.
- `components/`: UI; no lee ni escribe `localStorage` directamente.

## Alcance y limitaciones intencionales

Los productos, categorías, configuración y pedidos persisten en el mismo navegador. Esto permite validar cliente y administración sin infraestructura. No sincroniza dispositivos, no ofrece durabilidad de producción y el PIN `2026` es sólo una barrera explícita de demo, no autenticación real. No deben usarse datos personales reales en esta fase.

La aplicación sigue siendo de un único restaurante. No hay `agency_id`, tenant aportado por frontend ni acceso a base de datos. La futura adaptación multi-tenant deberá derivar el negocio de la sesión autenticada y aplicar RLS antes de habilitar persistencia remota.

## Impacto, despliegue y rollback

No requiere configuración: `npm run dev` habilita todo el circuito. El cambio es aditivo sobre la landing. Para restaurar datos se usa “Restaurar datos demo” en el panel; para revertir el código se despliega el commit anterior. Al conectar Supabase, se conserva la interfaz del repositorio y se cambia el adaptador, evitando reescribir UI y reglas.

## Próxima fase

Implementar `SupabaseCommerceRepository`, migraciones, Auth real, RLS, sincronización entre clientes y pruebas E2E contra staging. Antes de desplegar habrá que agregar idempotencia de pedidos, rate limiting, auditoría y manejo seguro de sesiones.

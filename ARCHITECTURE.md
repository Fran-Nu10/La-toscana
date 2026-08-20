# Arquitectura local de e-commerce

La landing y el circuito de pedidos funcionan completamente en el navegador. `CommerceProvider` expone el catálogo, la configuración y los pedidos; los servicios contienen las reglas de negocio; y `LocalCommerceRepository` persiste el estado en `localStorage`.

## Flujo

1. La carta consume categorías y productos del provider.
2. El carrito guarda productos, cantidades, opciones, adicionales y observaciones.
3. Checkout valida disponibilidad, modalidad, contacto, dirección, mínimo y precios contra el catálogo local.
4. Confirmación y seguimiento leen el pedido persistido mediante su token.
5. El panel local permite administrar catálogo, configuración, pedidos y estados.

## Alcance y seguridad

Es una demostración de un solo navegador: no hay backend, autenticación real, aislamiento multiusuario ni almacenamiento apto para datos personales reales. El PIN del panel sólo evita accesos accidentales en la demo y no constituye un control de seguridad.

No existe conexión a bases de datos, APIs externas ni pagos. Una futura persistencia remota deberá reemplazar el adaptador del repositorio y agregar autenticación, autorización, validación del lado servidor, idempotencia, rate limiting y auditoría sin confiar en datos o precios del cliente.

## Operación y rollback

No requiere variables de entorno. “Restaurar datos demo” vuelve a cargar la semilla local. El despliegue es sólo frontend y el rollback consiste en publicar el commit anterior.

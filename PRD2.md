Copia el siguiente texto y pégalo en el agente de tu otro proyecto:
# Contexto
Estoy desarrollando una interfaz gráfica para visualizar la memoria persistente de equipos de trabajo que utilizan "Engram" (un sistema local de memoria para agentes de IA). 
Engram levanta un servidor HTTP REST local por defecto en `http://127.0.0.1:7437`. Este servidor **no envía cabeceras CORS**, por lo que hacer peticiones `fetch()` directamente desde el navegador a ese puerto fallará por la política de mismo origen.
# Objetivo
Configurar un proxy de desarrollo en este proyecto frontend para evitar los errores de CORS al consumir la API local de Engram, y crear un cliente/servicio base para realizar las peticiones.
# Tareas a implementar
1. **Configurar el Proxy de Desarrollo:**
   - Analiza qué herramienta de *bundling* o framework estamos usando en este proyecto (Vite, Next.js, Create React App/Webpack, etc.).
   - Modifica el archivo de configuración correspondiente (`vite.config.js/ts`, `next.config.js`, `package.json`, etc.) para agregar un proxy.
   - El proxy debe interceptar todas las peticiones que comiencen con `/api/engram` (o una ruta similar que propongas) y redirigirlas a `http://127.0.0.1:7437`.
   - Asegúrate de reescribir la ruta para que `/api/engram/sessions` llegue al backend simplemente como `/sessions`.
2. **Crear un Cliente API base:**
   - Crea un archivo (ej. `src/services/engramApi.ts` o `.js`) que actúe como cliente para comunicarse con Engram.
   - Configura una constante o instancia (por ejemplo, usando `fetch` o `axios` si ya está instalado) que apunte a la ruta del proxy (`/api/engram`).
   - Implementa al menos dos funciones de prueba basadas en los endpoints estándar de Engram:
     - `getSessions()`: Debería hacer un GET a `/sessions`.
     - `getStats()`: Debería hacer un GET a `/stats`.
3. **Verificación:**
   - Explícame brevemente cómo quedó configurado el proxy y cómo debo usar el cliente API en mis componentes.
   - Si detectas que falta alguna dependencia o hay algún conflicto con la configuración actual, avísame antes de proceder con los cambios.
# Restricciones
- No modifiques el backend de Engram; la solución DEBE ser exclusivamente en el frontend usando el proxy de desarrollo.
- Usa las convenciones de código y estructura de carpetas que ya existan en este proyecto.
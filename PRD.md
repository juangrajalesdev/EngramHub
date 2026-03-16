# Plan: EngramHub - Plataforma de Sincronización de Equipo
## 1. Visión General del Proyecto
**EngramHub** será una aplicación web (Dashboard) que servirá como interfaz centralizada para visualizar, buscar y compartir los "recuerdos" (aprendizajes, decisiones de arquitectura, bugs resueltos) que los agentes de IA generan en el proyecto **Engram**.

El objetivo principal es resolver el problema de la fragmentación del conocimiento en equipos de desarrollo: si un agente resuelve un problema complejo en la máquina del Desarrollador A, el Desarrollador B debería poder beneficiarse de ese conocimiento automáticamente. EngramHub hará que este proceso sea visible, gobernable y fácil de buscar.

## 2. Arquitectura Propuesta
EngramHub operará bajo un modelo cliente-servidor local, aprovechando la infraestructura existente de Engram:

*   **Backend (Existente):** El binario actual de `engram` escrito en Go, que ya incluye un servidor HTTP local (`internal/server/server.go`) ejecutándose por defecto en el puerto 7437.
*   **Base de Datos (Existente):** SQLite local (`~/.engram/engram.db`) con soporte de búsqueda de texto completo (FTS5).
*   **Frontend (EngramHub):** Una aplicación Single Page Application (SPA) que se conectará a la API REST local de Engram.

## 3. Funcionalidades Clave y Mapeo de API

La interfaz de EngramHub se dividirá en las siguientes secciones principales, consumiendo los endpoints existentes:

### A. Línea de Tiempo Global (Timeline)
Un feed estilo red social que muestra cronológicamente las observaciones guardadas por los agentes.
*   **Endpoint:** `GET /timeline`
*   **Filtro:** Capacidad de filtrar por `project=NombreDelProyecto` para ver solo el contexto relevante a una tarea actual.
*   **UI:** Tarjetas que muestran: Tipo (Bugfix, Decisión, etc.), Título, Proyecto, Autor (si está sincronizado) y fecha. Al expandir, se muestra el contenido estructurado (Qué, Por qué, Dónde, Aprendizaje).

### B. Motor de Búsqueda Semántica (Search)
Una barra de búsqueda global para encontrar soluciones pasadas rápidamente.
*   **Endpoint:** `GET /search?q={query}&project={proyecto}`
*   **Backend:** Utiliza la tabla virtual `observations_fts` (FTS5) en SQLite para resultados ultrarrápidos.
*   **UI:** Resultados resaltados mostrando el contexto exacto donde la palabra clave fue encontrada.

### C. Centro de Sincronización de Equipo (Sync Hub)
La funcionalidad central para compartir y recibir conocimiento. Engram ya maneja la resolución de conflictos mediante un sistema de "Chunks" inmutables y un `manifest.json`.
*   **Estado:** Llamada a `GET /sync/status` para mostrar cuántos chunks locales están pendientes de exportar y cuántos remotos están pendientes de importar.
*   **Acciones Requeridas (Brecha de Backend):** Actualmente la sincronización se hace vía CLI (`engram sync` y `engram sync --import`). Para que la UI pueda disparar esto, **necesitaremos agregar dos nuevos endpoints POST en el backend de Go:**
    *   `POST /sync/export`: Empaqueta memorias locales en un nuevo chunk.
    *   `POST /sync/import`: Lee el manifest e importa chunks de otros desarrolladores.

## 4. Fases de Implementación (Hoja de Ruta)

### Fase 1: Extensión del Backend de Go (Preparación de la API)
1.  **Analizar `internal/server/server.go` y `internal/sync/sync.go`**: Validar la estructura actual de sincronización.
2.  **Crear Endpoint `POST /sync/export`**: Envolver la función `sy.Export()` para ser llamada vía HTTP.
3.  **Crear Endpoint `POST /sync/import`**: Envolver la función `sy.Import()` para ser llamada vía HTTP.
4.  **CORS**: Asegurar que el servidor local de Engram (`internal/server`) tenga configurado CORS para permitir peticiones desde el entorno de desarrollo del Frontend (ej. `localhost:3000` o `localhost:5173`).

### Fase 2: Desarrollo del Frontend (EngramHub)
1.  **Selección de Stack:** (Sugerencia inicial: React o Vue con Tailwind CSS para iteración rápida).
2.  **Configuración de Cliente API:** Crear un servicio en el frontend configurado para apuntar a `http://localhost:7437`.
3.  **Vistas Principales:**
    *   `Dashboard / Timeline`: Consumo de `/timeline`.
    *   `Search`: Consumo de `/search`.
    *   `Sync / Team`: Consumo de `/sync/status` y los nuevos endpoints POST.
4.  **Diseño Visual:** Adaptar la estética para que sea limpia y orientada a la productividad (quizás inspirada en la paleta Catppuccin que ya usa la TUI del proyecto).

### Fase 3: Integración y Pruebas
1.  **Pruebas Locales:** Generar memorias falsas vía CLI o agente, y verificar que EngramHub las renderiza correctamente.
2.  **Pruebas de Sincronización:** Simular un entorno de equipo (dos instancias de Engram) y usar la UI para exportar un chunk desde la Instancia A e importarlo desde la Instancia B.

## 5. Consideraciones de Diseño y Preguntas Abiertas

Antes de proceder a la implementación (fuera del Plan Mode), consideremos:

1.  **Empaquetado:** ¿Debería EngramHub ser un proyecto web completamente separado (repositorio independiente) o deberíamos aprovechar la idea original de `dashboard-htmx` y renderizar el HTML directamente desde el binario de Go para mantener la promesa de "Single Binary. Zero dependencies"?
    *   *Pro de React/Vue:* UI más rica e interactiva.
    *   *Pro de HTMX/Go:* No hay que instalar Node.js ni configurar un servidor web adicional; todo corre en el mismo ejecutable de Engram.

2.  **Seguridad Local:** Dado que el servidor de Engram corre en la máquina local, cualquier interfaz web asume confianza en la red local. Si se opta por una web separada, debemos manejar correctamente los orígenes CORS.

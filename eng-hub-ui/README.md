# EngramHub

> **El Dashboard Visual para la Memoria Semántica de Engram.**

EngramHub es una aplicación web (Single Page Application) diseñada para funcionar como la interfaz gráfica del sistema **Engram CLI**. Su objetivo principal es resolver la fragmentación del conocimiento en equipos de desarrollo, haciendo visible, gobernable y fácil de buscar la memoria persistente generada por agentes de IA (decisiones de arquitectura, bugs resueltos, patrones de código).

---

## 🚀 Características Principales

- **Timeline Global:** Un feed estilo red social que muestra cronológicamente las observaciones guardadas por los agentes. Incluye filtros por contexto/proyecto y paginación basada en cursores.
- **Búsqueda Semántica Rápida:** Encuentra soluciones pasadas instantáneamente utilizando el motor FTS5 de SQLite integrado en el backend de Engram, con resaltado de sintaxis en los resultados.
- **Sync Hub (Sincronización de Equipo):** Panel de control visual para empaquetar, exportar e importar "Chunks" de conocimiento entre diferentes miembros del equipo, facilitando el aprendizaje colectivo.
- **Soporte Markdown Avanzado:** Renderizado completo de las observaciones de los agentes, incluyendo tablas (GitHub Flavored) y resaltado de sintaxis para bloques de código (`highlight.js`).
- **Diseño Estético:** Interfaz limpia y orientada a la productividad basada en la popular paleta de colores oscuros **Catppuccin Mocha**.

## 🏗️ Arquitectura y Tecnologías

EngramHub opera bajo un modelo cliente-servidor local, asumiendo que el usuario tiene el binario de **Engram** ejecutándose en su máquina.

- **Frontend:** Construido con **React 18**, **TypeScript** y **Vite** para un desarrollo ultrarrápido.
- **Estilos:** **Tailwind CSS v3** con configuración de colores personalizados.
- **Routing:** `react-router-dom` para la navegación entre las vistas de Timeline, Search y Sync.
- **Comunicación API (El Proxy CORS):**
  Dado que el servidor HTTP local de Engram (Go) corre en `http://127.0.0.1:7437` y por defecto **no envía cabeceras CORS**, esta SPA utiliza un **Proxy de Desarrollo en Vite** (`vite.config.ts`). 
  
  Todas las peticiones del cliente (Axios) se hacen a la ruta relativa `/api/engram/*`. Vite intercepta estas llamadas, elimina el prefijo `/api/engram` y las redirige limpiamente al backend de Go, evitando proactivamente cualquier bloqueo por política de mismo origen en el navegador durante el desarrollo.

## 📋 Requisitos Previos

Para ejecutar EngramHub en tu entorno local, necesitas:

1.  **Node.js** (v18 o superior) y **npm**.
2.  **Engram CLI:** Debes tener el binario de Engram instalado y su servidor local ejecutándose en el puerto por defecto (`7437`). Si el motor no está corriendo, la interfaz mostrará un banner de error de conexión, aunque seguirá siendo navegable.

## 🛠️ Instalación y Uso (Desarrollo)

1.  **Clona el repositorio** y navega al directorio del frontend:
    ```bash
    git clone <url-del-repositorio>
    cd eng-hub-ui
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Abre la aplicación:**
    Vite te proporcionará una URL local. Abre tu navegador en:
    ```text
    http://localhost:5173
    ```
    *(La interfaz comenzará inmediatamente a consumir datos de tu base local a través del proxy).*

## 📁 Estructura del Proyecto

```text
eng-hub-ui/
├── public/                 # Assets estáticos
├── src/
│   ├── components/         # Componentes UI (Layout, ObservationCard, Skeletons)
│   ├── pages/              # Vistas principales (Timeline, Search, Sync)
│   ├── services/           # Cliente API (Axios) e interfaces TypeScript de los contratos
│   ├── App.tsx             # Router principal
│   ├── index.css           # Estilos de Tailwind y directivas de highlight.js
│   └── main.tsx            # Punto de entrada de React
├── tailwind.config.js      # Tema Catppuccin Mocha
└── vite.config.ts          # Configuración del bundler y del Proxy CORS
```

## ⚠️ Notas sobre Producción

El proxy configurado en `vite.config.ts` es una herramienta **exclusiva para el entorno de desarrollo** (`npm run dev`).

Si compilas la aplicación para producción (`npm run build`):
- **Despliegue Aislado:** Si planeas servir la carpeta `dist/` resultante desde un servidor web (Nginx, Apache) en un puerto distinto al de Engram, **deberás configurar un reverse proxy** que maneje el reenvío de peticiones tal como lo hace Vite.
- **Embebido en Go:** Si el plan final es incrustar los archivos estáticos generados (`dist/`) directamente dentro del binario compilado de Go (Zero Dependencies) usando `//go:embed`, el frontend y el backend compartirán el mismo origen (`:7437`). En ese escenario, los problemas de CORS desaparecen y el proxy no es necesario.

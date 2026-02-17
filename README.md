# Demo de Exportación CSV con Next.js y MySQL (Docker)

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado
- Node.js 18+ y [Yarn](https://yarnpkg.com/) o npm

## Instalación y ejecución

1. **Clona el repositorio y entra a la carpeta del proyecto:**

   ```sh
   git clone <url-del-repo>
   cd stream-export-demo
   ```

2. **Instala las dependencias:**

   ```sh
   yarn install
   # o
   npm install
   ```

3. **Levanta la base de datos MySQL con Docker:**

   ```sh
   docker compose up -d
   ```

   Esto creará la base de datos, la tabla `user_metrics` y la llenará automáticamente con 50,000 registros de prueba.

4. **Inicia la aplicación en modo desarrollo:**

   ```sh
   yarn dev
   # o
   npm run dev
   ```

   La app estará disponible en [http://localhost:3000](http://localhost:3000)

5. **(Opcional) Compila para producción:**
   ```sh
   yarn build && yarn start
   # o
   npm run build && npm start
   ```

## ¿Cómo funciona la demo?

- El frontend muestra un botón para descargar un archivo CSV grande (50,000 registros) y una barra de progreso en tiempo real.
- El backend (Next.js API Route) lee los datos desde MySQL y los envía por streaming, calculando el tamaño total para que la barra de progreso funcione correctamente.

## Notas

- Si necesitas reinicializar la base de datos (por ejemplo, para regenerar los datos), ejecuta:
  ```sh
  docker compose down
  docker compose up -d
  ```
- Puedes modificar la cantidad de registros editando el archivo `mysql-init/01_create_user_metrics.sql`.

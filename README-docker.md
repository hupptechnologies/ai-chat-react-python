# Dockerized React Frontend

## Build and Run with Docker Compose

1. Ensure Docker and Docker Compose are installed.
2. From the project root, run:

   ```bash
   docker-compose up --build
   ```

3. The app will be available at [http://localhost:3000](http://localhost:3000)

## How it works
- The React app is built in a Node.js container, then served as static files via Nginx.
- The Nginx server listens on port 80 inside the container, mapped to port 3000 on your host.

## Environment Variables
- If you need to set environment variables (e.g., `VITE_API_BASE_URL`), add them to a `.env` file in the `frontend` directory before building. 
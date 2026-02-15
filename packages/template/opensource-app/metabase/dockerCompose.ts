// Aligned with official Metabase Docker docs: https://www.metabase.com/docs/latest/installation-and-operation/running-metabase-on-docker
export const dockerCompose = `services:
  metabase:
    image: metabase/metabase:latest
    container_name: metabase
    hostname: metabase
    restart: unless-stopped
    ports:
      - "3100:3000"
    environment:
      MB_DB_TYPE: postgres
      MB_DB_DBNAME: metabaseappdb
      MB_DB_PORT: 5432
      MB_DB_USER: metabase
      MB_DB_PASS: mysecretpassword
      MB_DB_HOST: postgres
    networks:
      - metabasenet
    depends_on:
      - postgres
    volumes:
      - /dev/urandom:/dev/random:ro
    healthcheck:
      test: curl --fail -I http://localhost:3000/api/health || exit 1
      interval: 15s
      timeout: 5s
      retries: 20

  postgres:
    image: postgres:14
    container_name: postgres
    hostname: postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: metabase
      POSTGRES_DB: metabaseappdb
      POSTGRES_PASSWORD: mysecretpassword
    networks:
      - metabasenet
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U metabase -d metabaseappdb"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  metabasenet:
    driver: bridge

volumes:
  postgres_data:`;

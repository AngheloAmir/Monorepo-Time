export const dockerCompose = `services:
  mautic_db:
    image: mariadb:10.6
    command: --transaction-isolation=READ-COMMITTED --binlog-format=ROW
    environment:
      - MYSQL_ROOT_PASSWORD=mautic
      - MYSQL_DATABASE=mautic
      - MYSQL_USER=mautic
      - MYSQL_PASSWORD=mautic
    volumes:
      - mautic_db_data:/var/lib/mysql
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u root -pmautic || exit 1"]
      interval: 10s
      timeout: 10s
      retries: 5
      start_period: 40s

  mautic:
    image: mautic/mautic:v4
    environment:
      - MAUTIC_DB_HOST=mautic_db
      - MAUTIC_DB_USER=mautic
      - MAUTIC_DB_PASSWORD=mautic
      - MAUTIC_DB_NAME=mautic
      - MAUTIC_RUN_CRON_JOBS=true
      - MAUTIC_ADMIN_EMAIL=admin@example.com
      - MAUTIC_ADMIN_PASSWORD=mautic
    ports:
      - "0:80"
    volumes:
      - mautic_data:/var/www/html
    links:
      - mautic_db
    depends_on:
      mautic_db:
        condition: service_healthy
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:80/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mautic_db_data:
  mautic_data:`;

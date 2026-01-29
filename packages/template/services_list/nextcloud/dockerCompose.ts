export const dockerCompose = `services:
  db:
    image: mariadb:10.6
    restart: unless-stopped
    command: --transaction-isolation=READ-COMMITTED --binlog-format=ROW
    volumes:
      - db_data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=admin
      - MYSQL_PASSWORD=nextcloud_user_password
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud_user
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u root -padmin || exit 1"]
      interval: 10s
      timeout: 10s
      retries: 5
      start_period: 40s

  nextcloud:
    image: nextcloud:latest
    restart: unless-stopped
    ports:
      - "8080:80"
    links:
      - db
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - nextcloud_data:/var/www/html
    environment:
      - MYSQL_PASSWORD=nextcloud_user_password
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud_user
      - MYSQL_HOST=db
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:80/status.php || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  nextcloud_data:
  db_data:`;

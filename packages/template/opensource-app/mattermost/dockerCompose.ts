export const dockerCompose = `services:
  postgres:
    image: postgres:15-alpine
    pull_policy: if_not_present
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    pids_limit: 100
    read_only: true
    tmpfs:
      - /tmp
      - /var/run/postgresql
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=mattermost
      - POSTGRES_USER=mmuser
      - POSTGRES_PASSWORD=mmuser_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mmuser -d mattermost"]
      interval: 10s
      timeout: 5s
      retries: 5

  mattermost:
    image: mattermost/mattermost-team-edition:latest
    pull_policy: if_not_present
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    pids_limit: 200
    read_only: false
    tmpfs:
      - /tmp
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "7200:8065"
    volumes:
      - mattermost_config:/mattermost/config:rw
      - mattermost_data:/mattermost/data:rw
      - mattermost_logs:/mattermost/logs:rw
      - mattermost_plugins:/mattermost/plugins:rw
      - mattermost_client_plugins:/mattermost/client/plugins:rw
      - mattermost_bleve_indexes:/mattermost/bleve-indexes:rw
    environment:
      - MM_SQLSETTINGS_DRIVERNAME=postgres
      - MM_SQLSETTINGS_DATASOURCE=postgres://mmuser:mmuser_password@postgres:5432/mattermost?sslmode=disable&connect_timeout=10
      - MM_SERVICESETTINGS_SITEURL=http://localhost:7201
      - MM_BLEVESETTINGS_INDEXDIR=/mattermost/bleve-indexes
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8065/api/v4/system/ping || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  mattermost_config:
  mattermost_data:
  mattermost_logs:
  mattermost_plugins:
  mattermost_client_plugins:
  mattermost_bleve_indexes:`;

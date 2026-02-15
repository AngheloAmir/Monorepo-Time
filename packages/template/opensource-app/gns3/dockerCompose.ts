export const dockerCompose = `services:
  gns3-server:
    image: gns3/gns3-server:latest
    restart: unless-stopped
    ports:
      - "3080:3080"
    volumes:
      - gns3_data:/data
    environment:
      - GNS3_UID=1000
      - GNS3_GID=1000
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3080/v2/version"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  gns3_data:`;

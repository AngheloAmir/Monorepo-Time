export const dockerCompose = `services:
  webstudio:
    build:
      context: .
      dockerfile: Dockerfile
    pull_policy: if_not_present
    ports:
      - "5173:5173"
    volumes:
      - webstudio_data:/app
    environment:
      - DEV_LOGIN=true
      - AUTH_SECRET=webstudio-dev-secret-key-12345
      - NODE_ENV=development
    stdin_open: true
    tty: true

volumes:
  webstudio_data:`;

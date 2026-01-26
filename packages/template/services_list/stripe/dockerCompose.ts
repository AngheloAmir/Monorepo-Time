export const dockerCompose = `services:
  stripe-mock:
    image: stripe/stripe-mock:latest
    container_name: stripe-mock
    ports:
      - "12111:12111"
      - "12112:12112"
    healthcheck:
      test: ["CMD", "/usr/bin/curl", "-f", "http://localhost:12111/"]
      interval: 5s
      timeout: 5s
      retries: 5
`;

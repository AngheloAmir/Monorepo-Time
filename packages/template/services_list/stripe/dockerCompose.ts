export const dockerCompose = `services:
  stripe-mock:
    image: stripe/stripe-mock:latest
    pull_policy: if_not_present
    container_name: stripe-mock
    ports:
      - "4350:12111"
      - "4360:12112"
    healthcheck:
      test: ["CMD", "/usr/bin/curl", "-f", "http://localhost:12111/"]
      interval: 5s
      timeout: 5s
      retries: 5
`;

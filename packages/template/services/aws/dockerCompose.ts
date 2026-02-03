export const dockerCompose = `services:
  localstack:
    image: localstack/localstack:4.0
    pull_policy: if_not_present
    user: "1000:1000"
    ports:
      - "127.0.0.1:4566:4566"            # LocalStack Gateway
      - "127.0.0.1:4510-4559:4510-4559"  # External services port range
    environment:
      - DEBUG=\${DEBUG-}
      - SERVICES=s3,lambda,dynamodb,apigateway,sqs,sns,logs,cloudwatch
      - DOCKER_HOST=unix:///var/run/docker.sock
      - AWS_DEFAULT_REGION=us-east-1
    volumes:
      - ./localstack-data:/var/lib/localstack
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - cloud-net

  dynamodb-admin:
    image: aaronshaf/dynamodb-admin
    pull_policy: if_not_present
    ports:
      - "4330:8001"
    environment:
      - DYNAMO_ENDPOINT=http://localstack:4566
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
    depends_on:
      - localstack
    networks:
      - cloud-net

  s3-browser:
    image: machines/filestash
    pull_policy: if_not_present
    ports:
      - "4340:8334"
    depends_on:
      - localstack
    networks:
      - cloud-net

networks:
  cloud-net:
    driver: bridge`;

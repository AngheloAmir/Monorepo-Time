export const readmeContent = `# K3d + Headlamp Learning Environment

A local Kubernetes learning environment using k3d (k3s in Docker) and Headlamp (Kubernetes UI).

## 🚀 Quick Start

\`\`\`bash
npm run start
\`\`\`

This will:
1. Check if k3d is installed
2. Create a k3d cluster named "learning-cluster" (if not exists)
3. Start Headlamp UI to visualize the cluster
4. Provide quick reference commands

## 📦 Prerequisites

- **Docker**: Required for running k3d
- **k3d**: Install using one of these methods:
  - \`curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash\`
  - \`brew install k3d\` (macOS)
  - \`choco install k3d\` (Windows)

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| \`npm run start\` | Start the learning environment |
| \`npm run stop\` | Stop Headlamp and optionally the cluster |
| \`npm run cluster:start\` | Start the k3d cluster |
| \`npm run cluster:stop\` | Stop the k3d cluster |
| \`npm run cluster:delete\` | Delete the k3d cluster |
| \`npm run cluster:info\` | Show cluster information |

## 🎓 Learning Resources

### Kubernetes Basics
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/)
- [Interactive Tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/)

### K3d/K3s
- [K3d Documentation](https://k3d.io/)
- [K3s Documentation](https://docs.k3s.io/)

### Headlamp
- [Headlamp Documentation](https://headlamp.dev/docs/)

## 📚 Quick Examples

### Deploy Nginx
\`\`\`bash
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort
kubectl get services
\`\`\`

### Deploy a Pod
\`\`\`bash
kubectl run my-pod --image=nginx --restart=Never
kubectl get pods
kubectl logs my-pod
\`\`\`

### Create a Namespace
\`\`\`bash
kubectl create namespace dev
kubectl get namespaces
\`\`\`

### Scale Deployment
\`\`\`bash
kubectl scale deployment nginx --replicas=3
kubectl get pods -w
\`\`\`

### Apply YAML Configuration
\`\`\`bash
kubectl apply -f my-deployment.yaml
kubectl get all
\`\`\`

## 🏗️ Cluster Architecture

The k3d cluster created has:
- 1 Server node (control plane)
- 2 Agent nodes (workers)
- LoadBalancer exposed on ports 8080 (HTTP) and 8443 (HTTPS)
- API server on port 6443

## ➕ Adding More Clusters to Headlamp

Headlamp supports connecting to multiple Kubernetes clusters. Here are the different ways to add clusters:

### Method 1: Via Headlamp UI (Recommended)

Dynamic cluster management is enabled by default. To add a new cluster:

1. Open Headlamp at **http://localhost:7000**
2. Click **⚙️ Settings** in the left sidebar
3. Click **"Add Cluster"**
4. Fill in the cluster details:
   - **Name**: A friendly name for the cluster
   - **Server URL**: The API server URL (e.g., \`https://my-cluster:6443\`)
   - **Authentication**: Choose token, certificate, or other auth method
5. Click **Save**

The cluster will appear in the cluster selector dropdown.

### Method 2: Edit kubeconfig File

Add cluster entries directly to the \`.kube/config\` file:

\`\`\`yaml
apiVersion: v1
kind: Config
clusters:
- cluster:
    server: https://cluster1:6443
    insecure-skip-tls-verify: true
  name: cluster1
- cluster:
    server: https://cluster2:6443
    insecure-skip-tls-verify: true
  name: cluster2
contexts:
- context:
    cluster: cluster1
    user: admin@cluster1
  name: cluster1
- context:
    cluster: cluster2
    user: admin@cluster2
  name: cluster2
current-context: cluster1
users:
- name: admin@cluster1
  user:
    client-certificate-data: <base64-cert>
    client-key-data: <base64-key>
- name: admin@cluster2
  user:
    token: <bearer-token>
\`\`\`

After editing, restart Headlamp:
\`\`\`bash
docker compose restart headlamp
\`\`\`

### Method 3: Merge Multiple kubeconfigs

Combine kubeconfigs from multiple clusters:

\`\`\`bash
# Export kubeconfig from another k3d cluster
k3d kubeconfig get another-cluster > another-cluster.yaml

# Merge with existing config
KUBECONFIG=./.kube/config:another-cluster.yaml kubectl config view --merge --flatten > merged-config.yaml

# Replace the config
mv merged-config.yaml ./.kube/config

# Restart Headlamp
docker compose restart headlamp
\`\`\`

### Method 4: Create Additional k3d Clusters

Create a new k3d cluster and add it to Headlamp:

\`\`\`bash
# Create a new cluster
k3d cluster create dev-cluster --api-port 6444

# Get and merge its kubeconfig
k3d kubeconfig get dev-cluster >> ./.kube/config

# Restart Headlamp
docker compose restart headlamp
\`\`\`

### Switching Between Clusters

In Headlamp UI:
1. Click the cluster name in the top-left corner
2. Select the cluster you want to view from the dropdown

Using kubectl:
\`\`\`bash
# List all contexts
kubectl config get-contexts

# Switch context
kubectl config use-context dev-cluster
\`\`\`

## ❓ Troubleshooting

### Cluster not accessible
\`\`\`bash
k3d kubeconfig merge learning-cluster --kubeconfig-merge-default
kubectl cluster-info
\`\`\`

### Reset kubeconfig
\`\`\`bash
k3d kubeconfig get learning-cluster > ~/.kube/config
\`\`\`

### View cluster logs
\`\`\`bash
docker logs k3d-learning-cluster-server-0
\`\`\`

### Headlamp shows "No clusters found"
\`\`\`bash
# Verify kubeconfig exists and is valid
cat ./.kube/config

# Restart Headlamp
docker compose restart headlamp

# Check Headlamp logs
docker logs k3d-headlamp-headlamp-1
\`\`\`

### YAML parsing error in kubeconfig
Ensure proper indentation (2 spaces per level). Use a YAML validator:
\`\`\`bash
python3 -c "import yaml; yaml.safe_load(open('./.kube/config'))"
\`\`\`
`;

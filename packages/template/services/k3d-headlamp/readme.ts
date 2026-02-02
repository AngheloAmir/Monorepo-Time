export const readmeContent = `# K3d + Headlamp Learning Environment

A local Kubernetes learning environment using k3d (k3s in Docker) and Headlamp (Kubernetes UI).

## 🚀 Quick Start

\\\`\\\`\\\`bash
npm run start
\\\`\\\`\\\`

This will:
1. Check if k3d is installed
2. Create a k3d cluster named "learning-cluster" (if not exists)
3. Start Headlamp UI to visualize the cluster
4. Provide quick reference commands

## 📦 Prerequisites

- **Docker**: Required for running k3d
- **k3d**: Install using one of these methods:
  - \\\`curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash\\\`
  - \\\`brew install k3d\\\` (macOS)
  - \\\`choco install k3d\\\` (Windows)

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| \\\`npm run start\\\` | Start the learning environment |
| \\\`npm run stop\\\` | Stop Headlamp and optionally the cluster |
| \\\`npm run cluster:start\\\` | Start the k3d cluster |
| \\\`npm run cluster:stop\\\` | Stop the k3d cluster |
| \\\`npm run cluster:delete\\\` | Delete the k3d cluster |
| \\\`npm run cluster:info\\\` | Show cluster information |

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
\\\`\\\`\\\`bash
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort
kubectl get services
\\\`\\\`\\\`

### Deploy a Pod
\\\`\\\`\\\`bash
kubectl run my-pod --image=nginx --restart=Never
kubectl get pods
kubectl logs my-pod
\\\`\\\`\\\`

### Create a Namespace
\\\`\\\`\\\`bash
kubectl create namespace dev
kubectl get namespaces
\\\`\\\`\\\`

### Scale Deployment
\\\`\\\`\\\`bash
kubectl scale deployment nginx --replicas=3
kubectl get pods -w
\\\`\\\`\\\`

### Apply YAML Configuration
\\\`\\\`\\\`bash
kubectl apply -f my-deployment.yaml
kubectl get all
\\\`\\\`\\\`

## 🏗️ Cluster Architecture

The k3d cluster created has:
- 1 Server node (control plane)
- 2 Agent nodes (workers)
- LoadBalancer exposed on ports 8080 (HTTP) and 8443 (HTTPS)
- API server on port 6443

## ❓ Troubleshooting

### Cluster not accessible
\\\`\\\`\\\`bash
k3d kubeconfig merge learning-cluster --kubeconfig-merge-default
kubectl cluster-info
\\\`\\\`\\\`

### Reset kubeconfig
\\\`\\\`\\\`bash
k3d kubeconfig get learning-cluster > ~/.kube/config
\\\`\\\`\\\`

### View cluster logs
\\\`\\\`\\\`bash
docker logs k3d-learning-cluster-server-0
\\\`\\\`\\\`
`;

# Local Kubernetes deployment

This setup is for Docker Desktop Kubernetes and keeps MongoDB on the existing Atlas deployment. It does not change the Render deployment or the existing Docker Compose setup.

## Architecture

- The browser opens the frontend at `http://localhost:30080`.
- In this Kubernetes build, frontend API calls use same-origin `/api/...` URLs. Nginx proxies them to the in-cluster `backend:5000` Service; browser code never uses Kubernetes DNS.
- The backend connects to the existing Atlas database using a Kubernetes Secret.
- Prometheus scrapes `http://backend:5000/metrics` inside the `placement-portal` namespace.
- Grafana provisions the Prometheus data source and the College Placement Portal dashboard automatically.

The frontend keeps the existing Render backend as its default. The Docker build sets `VITE_API_URL` to an empty string only for this Kubernetes image, so the deployed Render frontend configuration is preserved.

## Build local images

Run from the repository root. Docker Desktop Kubernetes can use images built in the active Docker Desktop context; manifests use `imagePullPolicy: IfNotPresent`.

```sh
docker build -t college-placement-backend:local ./server
docker build --build-arg VITE_API_URL= -t college-placement-frontend:local ./client
docker image inspect college-placement-backend:local college-placement-frontend:local
```

The backend Docker build excludes `.env`; credentials are supplied to Kubernetes separately.

## Secret setup and deployment

The manifests refer to two Secrets and contain no secret values:

- `placement-portal-backend`: keys `MONGO_URI` and `JWT_SECRET`.
- `grafana-admin`: key `admin-password`.

Creating these Secrets changes cluster secret state, so review/authorize that step before running it. Create a namespace first, then create the Secrets without printing their values:

```sh
kubectl apply -f k8s/namespace.yaml
kubectl create secret generic placement-portal-backend \
  --namespace placement-portal \
  --from-env-file=server/.env
kubectl create secret generic grafana-admin \
  --namespace placement-portal \
  --from-literal=admin-password="$(openssl rand -base64 32)"
```

Record the generated Grafana password in a password manager; the generated value is not printed by these commands. If you already created either Secret, do not run `kubectl create` again; inspect only its metadata with `kubectl describe secret` (that does not display secret values).

Validate, build, then deploy:

```sh
kubectl apply --dry-run=client -f k8s/
kubectl apply -f k8s/
kubectl rollout status deployment/backend -n placement-portal --timeout=5m
kubectl rollout status deployment/frontend -n placement-portal --timeout=3m
kubectl rollout status deployment/prometheus -n placement-portal --timeout=3m
kubectl rollout status deployment/grafana -n placement-portal --timeout=3m
```

## Access and verification

- Frontend: <http://localhost:30080>
- Backend health: <http://localhost:30080/api/health>
- Backend metrics: `kubectl port-forward -n placement-portal service/backend 5001:5000`, then <http://localhost:5001/metrics> (port 5000 is already used by the existing Compose backend)
- Prometheus: <http://localhost:30090>
- Grafana: <http://localhost:30300> (user `admin`, password from the `grafana-admin` Secret)

Useful checks:

```sh
kubectl get all,configmaps,secrets -n placement-portal
kubectl get events -n placement-portal --sort-by=.lastTimestamp
kubectl logs deployment/backend -n placement-portal
kubectl logs deployment/prometheus -n placement-portal
kubectl logs deployment/grafana -n placement-portal
```

In Prometheus, open **Status → Targets** and confirm `placement-backend` is **UP**. Query `http_requests_total`, `rate(http_requests_total[1m])`, or `http_request_duration_seconds_bucket`. In Grafana, open the provisioned **College Placement Portal** dashboard and check the Prometheus data source under **Connections → Data sources**.

## Controlled local traffic scenarios

The script refuses non-loopback targets and only calls the read-only `/api/health` endpoint. Let Prometheus scrape for at least 15 seconds between scenarios so graphs have samples.

```sh
# Scenario 1: baseline; sends zero requests
node k8s/load-test.mjs baseline

# Scenario 2: 5 concurrent workers, 150 total health requests
node k8s/load-test.mjs small

# Scenario 3: bounded higher traffic, 25 concurrent workers, 500 total requests
node k8s/load-test.mjs many
```

Expected result: request rate and total request count rise in the small and many scenarios. The duration and CPU/memory panels provide additional runtime context. Do not point the script at the public Render service.

## Stop or remove

To stop workloads while keeping the namespace and configuration:

```sh
kubectl scale deployment --all --replicas=0 -n placement-portal
```

To resume, reapply `k8s/` and scale the Deployments to one replica. Removing the namespace deletes all resources and ephemeral Prometheus/Grafana data in it; do that only when you intend to remove this local deployment:

```sh
kubectl delete namespace placement-portal
```

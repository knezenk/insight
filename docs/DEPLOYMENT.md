# Deployment

## Local (desenvolvimento)

```bash
git clone https://github.com/knezenk/insight.git
cd insight
pnpm install
cp .env.example .env
docker compose up -d redis
pnpm dev
```

Disponível em:
- API · http://localhost:3001/api/v1
- Swagger · http://localhost:3001/api/docs
- Web · http://localhost:5173

## Stack completa local (Docker)

```bash
pnpm docker:up           # api + web + redis (stage development)
pnpm docker:logs         # acompanhar logs
pnpm docker:down         # encerrar
```

## Produção

### Pré-requisitos

- Cluster Kubernetes (EKS/GKE/AKS) ou VPS com Docker
- Redis gerenciado (ElastiCache, Memorystore, Upstash)
- Domínio + certificado TLS (Let's Encrypt via cert-manager ou ACM)
- Secrets manager (AWS SSM, Vault, K8s Secrets)

### Variáveis críticas em produção

```env
NODE_ENV=production
FAKE_DATA=0                              # ATIVA modo real
JWT_SECRET=<openssl rand -base64 64>     # CRÍTICO mudar do default
LOG_PRETTY=false
REDIS_URL=rediss://prod-cache:6380
API_CORS_ORIGINS=https://insight.example.com

CLIPPING_API_BASE_URL=https://clipping-prod.example.com
CLIPPING_API_TOKEN=<from secrets manager>
NLP_API_BASE_URL=https://nlp-prod.example.com
NLP_API_TOKEN=<from secrets manager>

OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=https://otel.example.com
SENTRY_DSN=<dsn>
```

### Build de imagens

```bash
docker build -f infra/docker/Dockerfile --target production-api -t insight/api:1.0.0 .
docker build -f infra/docker/Dockerfile --target production-web -t insight/web:1.0.0 .
```

### Push para registry

```bash
docker tag insight/api:1.0.0 registry.example.com/insight/api:1.0.0
docker push registry.example.com/insight/api:1.0.0
```

### Deploy com Compose (single-host)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Deploy em Kubernetes (esqueleto)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: insight-api }
spec:
  replicas: 3
  selector: { matchLabels: { app: insight-api } }
  template:
    metadata: { labels: { app: insight-api } }
    spec:
      containers:
        - name: api
          image: registry.example.com/insight/api:1.0.0
          envFrom:
            - secretRef: { name: insight-api-env }
          ports:
            - containerPort: 3001
          readinessProbe:
            httpGet: { path: /api/v1/health, port: 3001 }
            periodSeconds: 10
          livenessProbe:
            httpGet: { path: /api/v1/healthz, port: 3001 }
            periodSeconds: 15
          resources:
            limits: { cpu: 1000m, memory: 512Mi }
            requests: { cpu: 200m, memory: 256Mi }
```

### Estratégias de rollout

- **API**: rolling update (default K8s) com `maxSurge: 1, maxUnavailable: 0`
- **Web**: blue-green via versionamento de assets na CDN
- **Migrations**: N/A (sistema sem DB próprio)

### Smoke tests pós-deploy

```bash
curl https://insight.example.com/healthz | jq
curl -X POST https://insight.example.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"smoketest@...","password":"..."}' | jq
```

### Rollback

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  --env-file .env.prod up -d --force-recreate api=insight/api:0.9.0
```

Ou em K8s: `kubectl rollout undo deployment/insight-api`.

## Observabilidade em produção

- Logs JSON via stdout → coletor (Loki, Datadog, CloudWatch)
- Tracing OTLP → Tempo, Jaeger, Datadog APM
- Métricas Prometheus em `/metrics` (planejado)
- Sentry para errors do client e server
- Healthchecks integrados ao LB (target group health)

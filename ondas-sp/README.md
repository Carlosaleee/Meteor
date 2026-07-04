# 🌊 Ondas SP

**Previsão do tempo e condições de surf em tempo real para Ilha Comprida, SP.**

> Projeto full-stack com Spring Boot 3 + React + Vite, consumindo dados gratuitos da [Open-Meteo API](https://open-meteo.com/) e [wttr.in](https://wttr.in/) como fallback.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Java 21, Spring Boot 3.3, JPA, Flyway |
| Banco de dados | PostgreSQL 16 |
| Cache | Redis 7 |
| Frontend | React 18, Vite 5, TypeScript, Tailwind CSS v3 |
| Gráficos | Recharts |
| Mapas | Leaflet + React-Leaflet |
| Documentação | OpenAPI (Springdoc) |
| Testes Backend | JUnit 5, Mockito, Testcontainers |
| Testes Frontend | Vitest, React Testing Library |
| Testes E2E | Playwright |
| Resiliência | Resilience4j (circuit breaker + retry) |
| Rate Limiting | In-memory counter (60 req/min) |
| CI/CD | GitHub Actions |
| Containerização | Docker + Docker Compose |
| Deploy | Render |

---

## Funcionalidades

- 🌤️ **Previsão do tempo** — temperatura, vento, umidade, UV e precipitação
- 🌊 **Previsão de ondas** — altura, período, direção, swell
- 🏄 **Score de surf** — nota 0–10 calculada por algoritmo (altura de onda + vento + swell)
- 🤖 **Resumo em linguagem natural** — gerado pelo serviço de pontuação
- 📍 **Mapa de picos** — localizações dos melhores pontos de Ilha Comprida
- 🔁 **Sincronização automática** — scheduler a cada 2h + botão manual
- 🌙 **Dark mode** — alternância com persistência em localStorage
- 🛡️ **Rate limiting** — 60 requisições por minuto por IP
- ⚡ **Circuit breaker** — fallback automático quando APIs externas falham
- 🔄 **Retry** — retentativa automática com backoff exponencial
- 📦 **Code splitting** — carregamento lazy de rotas com React.lazy
- 🚫 **Error boundaries** — isolamento de erros por seção da UI
- ♿ **Acessibilidade** — prefers-reduced-motion, skip-link, aria-labels, focus-visible
- 🔍 **SEO** — sitemap.xml, robots.txt, Open Graph meta tags

---

## Quick Start (Docker)

```bash
# Clone o repositório
git clone <repo-url>
cd ondas-sp

# Copiar variáveis de ambiente
cp .env.example .env

# Subir todos os serviços
docker-compose up -d

# Verificar saúde da API
curl http://localhost:8080/api/health

# Buscar dados externos
curl -X POST http://localhost:8080/api/sync
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/api-docs |

---

## Desenvolvimento Local

### Pré-requisitos

- Java 21+
- Node 20+
- Docker (para PostgreSQL e Redis)

### Subir infraestrutura

```bash
docker-compose up -d postgres redis
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173 (com proxy para :8080)
```

---

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/ondassp` | URL do PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Usuário do banco |
| `SPRING_DATASOURCE_PASSWORD` | `postgres` | Senha do banco |
| `SPRING_DATA_REDIS_HOST` | `localhost` | Host do Redis |
| `SPRING_DATA_REDIS_PORT` | `6379` | Porta do Redis |
| `OPEN_METEO_API_URL` | `https://api.open-meteo.com` | Base URL da Open-Meteo |
| `APP_CORS_ORIGINS` | `http://localhost:3000` | Origens permitidas CORS |

> Consulte `.env.example` para todas as variáveis disponíveis.

---

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Health check (DB + Redis) |
| `POST` | `/api/sync` | Forçar sincronização de dados |
| `GET` | `/api/weather/current` | Clima atual |
| `GET` | `/api/weather/hourly?date=YYYY-MM-DD` | Clima por dia |
| `GET` | `/api/waves/current` | Ondas atuais |
| `GET` | `/api/waves/hourly?date=YYYY-MM-DD` | Ondas por dia |
| `GET` | `/api/surf/score?date=YYYY-MM-DD` | Score de surf |
| `GET` | `/api/surf/summary?date=YYYY-MM-DD` | Resumo em linguagem natural |
| `GET` | `/api/spots` | Lista de picos de surf |

---

## Arquitetura

```
backend/src/main/java/com/meteor/ondassp/
├── domain/
│   ├── weather/       # WeatherData, WeatherDataRepository
│   ├── wave/          # WaveData, WaveDataRepository
│   └── spot/          # Spot (value object)
├── application/
│   ├── WeatherService     # Sync + query de dados de clima
│   ├── MarineService      # Sync + query de dados de ondas
│   └── SurfScoreService   # Cálculo de score e geração de resumo
├── infrastructure/
│   ├── api/           # OpenMeteoClient, StormglassClient
│   ├── config/        # CacheConfig, WebConfig, RateLimitFilter
│   └── scheduler/     # DataSyncScheduler (cron 2h)
└── api/
    ├── HealthController     # Health check com DB + Redis
    ├── WeatherController
    ├── WaveController
    ├── SurfController
    ├── SpotController
    ├── SyncController
    └── dto/               # DTOs de resposta

frontend/src/
├── pages/             # Dashboard, SpotsPage, NacionalPage
├── components/        # WeatherCard, WaveCard, SpotCard, SurfScoreCard, etc.
├── hooks/             # useWeather, useWaves, useSpots, useSurfScore, useDarkMode
├── services/          # api.ts (fetchJson, postJson)
└── types/             # TypeScript interfaces
```

---

## Testes

### Backend

```bash
cd backend

# Rodar testes unitários
./mvnw test

# Rodar todos os testes (incluindo integração com Testcontainers)
./mvnw verify

# Sem coverage check
./mvnw test -Djacoco.skip=true
```

### Frontend

```bash
cd frontend

# Rodar testes unitários
npm test

# Modo watch
npm run test:watch

# Testes E2E (requer dev server rodando)
npm run dev          # Terminal 1
npx playwright test  # Terminal 2
```

### Cobertura

- Backend: JaCoCo (relatório em `backend/target/site/jacoco/`)
- Frontend: Vitest (relatório HTML)

---

## CI/CD

### GitHub Actions

- **CI** (`.github/workflows/ci.yml`): lint, type check, testes unitários, build
- **CD** (`.github/workflows/cd.yml`): deploy automático no Render

### Secrets necessários

| Secret | Descrição |
|---|---|
| `RENDER_SERVICE_ID` | ID do serviço no Render |
| `RENDER_API_KEY` | API key do Render |

---

## Resiliência

### Circuit Breaker (Resilience4j)

- **OpenMeteo**: fallback para wttr.in quando API principal falha
- **Stormglass**: fallback vazio com log de aviso
- Configuração: sliding window 10, failure threshold 50%, wait 30s

### Retry

- Máximo 3 tentativas
- Backoff exponencial (500ms, 1s, 2s)

### Rate Limiting

- 60 requisições por minuto por IP
- Resposta 429 com mensagem em português

---

## Segurança

- **CORS**: origens explícitas no `render.yaml`
- **Security headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy
- **Gzip**: compressão habilitada no nginx
- **Cache headers**: assets estáticos com cache de 1 ano
- **Variáveis sensíveis**: `.env` no `.gitignore`, `.env.example` como template

---

## SEO & Acessibilidade

- `sitemap.xml` e `robots.txt` em `frontend/public/`
- Open Graph meta tags para compartilhamento
- `prefers-reduced-motion`: animações desabilitadas para usuários com sensitividade
- Skip-link para navegação por teclado
- Focus-visible indicators
- Screen reader only labels (`.sr-only`)

---

## Licença

MIT © Meteor / AntyGravity

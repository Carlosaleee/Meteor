# 🌊 Ondas SP

**Previsão do tempo e condições de surf em tempo real para Ilha Comprida, SP.**

> Projeto full-stack com Spring Boot 3 + React + Vite, consumindo dados gratuitos da [Open-Meteo API](https://open-meteo.com/).

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Java 21, Spring Boot 3.3, JPA, Flyway |
| Banco de dados | PostgreSQL 16 |
| Cache | Redis 7 |
| Frontend | React 18, Vite 5, TypeScript, Tailwind CSS v3 |
| Gráficos | Recharts |
| Documentação | OpenAPI (Springdoc) |
| Testes | JUnit 5, Mockito |
| Containerização | Docker + Docker Compose |

---

## Funcionalidades

- 🌤️ **Previsão do tempo** — temperatura, vento, umidade, UV e precipitação
- 🌊 **Previsão de ondas** — altura, período, direção, swell
- 🏄 **Score de surf** — nota 0–10 calculada por algoritmo (altura de onda + vento + swell)
- 🤖 **Resumo em linguagem natural** — gerado pelo serviço de pontuação
- 📍 **Mapa de picos** — localizações dos melhores pontos de Ilha Comprida
- 🔁 **Sincronização automática** — scheduler a cada 2h + botão manual
- 🌙 **Dark mode** — alternância com persistência em localStorage

---

## Quick Start (Docker)

```bash
# Clone o repositório
git clone <repo-url>
cd ondas-sp

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
npm run dev       # http://localhost:3000 (com proxy para :8080)
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

> **Nota**: Dados de ondas utilizam a [Open-Meteo Marine API](https://marine-api.open-meteo.com) — completamente gratuita, sem necessidade de chave.

---

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Health check |
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
│   ├── weather/   # WeatherData, WeatherDataRepository
│   ├── wave/      # WaveData, WaveDataRepository
│   └── spot/      # Spot (value object)
├── application/
│   ├── WeatherService     # Sync + query de dados de clima
│   ├── MarineService      # Sync + query de dados de ondas
│   └── SurfScoreService   # Cálculo de score e geração de resumo
├── infrastructure/
│   ├── api/       # OpenMeteoClient, StormglassClient (marine)
│   ├── config/    # CacheConfig (Redis), WebConfig (CORS)
│   └── scheduler/ # DataSyncScheduler (cron 2h)
└── api/
    ├── HealthController
    ├── WeatherController
    ├── WaveController
    ├── SurfController
    ├── SpotController
    ├── SyncController
    └── dto/       # DTOs de resposta
```

---

## Testes

```bash
cd backend
./mvnw test

# Com relatório de cobertura (JaCoCo)
./mvnw verify
```

Cobertura mínima alvo: **80%**

---

## Licença

MIT © Meteor / AntyGravity

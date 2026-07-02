# 🌊 Meteor

> **Plataforma moderna de previsão do tempo, mar e ondas para surfistas e amantes do litoral.**

O **Meteor** é uma aplicação desenvolvida para fornecer previsões meteorológicas e marítimas precisas para o litoral brasileiro, com foco inicial em **Ilha Comprida - SP** e região do Vale do Ribeira.

O projeto reúne dados provenientes de APIs meteorológicas e oceânicas em uma interface moderna, rápida e responsiva, oferecendo informações relevantes para surfistas, pescadores, atletas e turistas.

---

# ✨ Principais funcionalidades

* 🌤️ Previsão do tempo em tempo real
* 🌊 Previsão de altura das ondas
* 🌬️ Velocidade e direção do vento
* 🧭 Direção do swell
* ⏱️ Período das ondas
* 🏄 Surf Score inteligente
* 🤖 Resumo gerado por Inteligência Artificial
* 📈 Histórico e gráficos de previsão
* 🌙 Modo claro e escuro
* 🔄 Atualização automática das previsões
* 📱 Interface totalmente responsiva

---

# 🖥️ Tecnologias

## Backend

* Java 21
* Spring Boot
* Spring Web
* Spring Data
* REST API
* Docker
* PostgreSQL
* Redis
* OpenAPI / Swagger

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide Icons
* React Hooks

---

# 🌎 Fontes de dados

O sistema foi projetado para consumir dados de serviços especializados em meteorologia e oceanografia.

Entre eles:

* Open-Meteo
* Open-Meteo Marine
* Stormglass (quando configurado)
* Outras integrações futuras

---

# 🏗️ Arquitetura

```text
                 React + Vite

                       │

                 REST API

                       │

          Spring Boot Application

      ┌──────────────┬──────────────┐

 Weather Service      Marine Service

      │                     │

 Open-Meteo          Marine Forecast

      └──────────────┬──────────────┘

                Business Layer

                       │

              PostgreSQL + Redis
```

---

# 📁 Estrutura do projeto

```text
backend/

 ├── controllers
 ├── services
 ├── repositories
 ├── entities
 ├── dto
 ├── config
 ├── scheduler

frontend/

 ├── components
 ├── hooks
 ├── pages
 ├── services
 ├── assets
 ├── styles
 ├── types
```

---

# 🚀 Como executar

## Clone o repositório

```bash
git clone https://github.com/Carlosaleee/Meteor.git
```

```bash
cd Meteor
```

---

## Backend

```bash
cd backend
```

Execute:

```bash
./mvnw spring-boot:run
```

ou

```bash
mvn spring-boot:run
```

---

## Frontend

```bash
cd frontend
```

Instale as dependências

```bash
npm install
```

Execute

```bash
npm run dev
```

---

# 🐳 Docker

Caso o projeto possua Docker configurado:

```bash
docker compose up --build
```

---

# 📡 API

Exemplos de endpoints:

```http
GET /api/weather/current
```

```http
GET /api/weather/hourly
```

```http
GET /api/waves/current
```

```http
GET /api/waves/hourly
```

```http
GET /api/surf-score
```

```http
GET /api/surf-summary
```

---

# 🎯 Objetivos

O Meteor busca centralizar informações essenciais para atividades no litoral, oferecendo uma experiência moderna, intuitiva e baseada em dados atualizados.

Entre os objetivos futuros estão:

* previsão de marés
* webcams ao vivo
* radar meteorológico
* mapa interativo
* alertas inteligentes
* notificações em tempo real
* Progressive Web App (PWA)
* aplicativo mobile

---

# 📊 Roadmap

* [x] Dashboard inicial
* [x] Integração com previsão do tempo
* [x] Integração com previsão de ondas
* [x] Surf Score
* [x] Resumo por IA
* [ ] Mapa interativo
* [ ] Sistema de usuários
* [ ] Favoritos
* [ ] Alertas inteligentes
* [ ] Webcams
* [ ] Notícias do surf
* [ ] Painel administrativo
* [ ] Aplicativo Mobile

---

# 🤝 Contribuindo

Contribuições são bem-vindas.

1. Faça um Fork
2. Crie uma Branch
3. Faça seus commits
4. Abra um Pull Request

---

# 📄 Licença

Este projeto é distribuído sob a licença definida pelos mantenedores do repositório.

---

# 👨‍💻 Autor

**Carlos Alexandre**

GitHub: https://github.com/Carlosaleee

LinkedIn: https://www.linkedin.com/in/carlos-alexandre-66b962279/

---

## ⭐ Se este projeto foi útil, deixe uma estrela no repositório!

# 🛒 ShopManager — Full-Stack Portfolio Project

![Java](https://img.shields.io/badge/Java-17-orange?style=flat&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen?style=flat&logo=spring)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat&logo=mysql)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow?style=flat)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?style=flat&logo=docker)

Un sistema di **gestione prodotti e ordini** full-stack — progetto portfolio per dimostrare l'integrazione tra **backend Java**, **database MySQL** e **frontend React**.

---

## 🏗️ Architettura

```
┌─────────────────────┐    HTTP / JWT    ┌────────────────────┐
│   React 18 + Vite   │◄────────────────►│  Spring Boot 3.2   │
│  (porta 5173)       │                  │  REST API          │
└─────────────────────┘                  │  (porta 8080)      │
                                         └───────┬────────────┘
                                                 │ JPA / Hibernate
                                         ┌───────▼────────────┐
                                         │   MySQL 8.0        │
                                         │  (porta 3306)      │
                                         └────────────────────┘
```

## 🚀 Stack Tecnologico

| Layer | Tecnologia |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2 |
| Database | MySQL 8.0, Spring Data JPA / Hibernate |
| Auth | Spring Security + JWT (jjwt 0.12) |
| Frontend | React 18, Vite, Axios, React Router v6 |
| Infrastruttura | Docker Compose |

---

## 📁 Struttura del Progetto

```
fullstack-portfolio/
├── backend/                          # Spring Boot Maven project
│   └── src/main/java/com/portfolio/backend/
│       ├── BackendApplication.java   # Entry point
│       ├── DataSeeder.java           # Dati di esempio al primo avvio
│       ├── controller/               # REST Controllers
│       │   ├── AuthController.java
│       │   ├── ProductController.java
│       │   └── OrderController.java
│       ├── service/                  # Business Logic
│       │   ├── AuthService.java
│       │   ├── ProductService.java
│       │   └── OrderService.java
│       ├── entity/                   # JPA Entities
│       │   ├── User.java
│       │   ├── Product.java
│       │   └── Order.java
│       ├── repository/               # Spring Data JPA Repositories
│       ├── security/                 # JWT + Spring Security
│       │   ├── JwtUtil.java
│       │   ├── JwtAuthFilter.java
│       │   └── SecurityConfig.java
│       ├── dto/                      # Data Transfer Objects
│       └── exception/                # Global Exception Handler
│
├── frontend/                         # React + Vite
│   └── src/
│       ├── App.jsx                   # Router + Navbar
│       ├── context/AuthContext.jsx   # Stato autenticazione globale
│       ├── services/api.js           # Axios HTTP client
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           ├── Products.jsx          # CRUD prodotti
│           └── Orders.jsx
│
├── docker-compose.yml                # MySQL container
└── README.md
```

---

## ⚡ Avvio Rapido

### Prerequisiti
- **Java 17+** — [Download](https://adoptium.net/)
- **Maven 3.8+** — [Download](https://maven.apache.org/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Docker Desktop** — [Download](https://www.docker.com/products/docker-desktop/) *(oppure MySQL locale)*

### 1. Avvia il Database MySQL

```bash
# Dalla cartella radice del progetto
docker-compose up -d
```

MySQL sarà disponibile su `localhost:3306` con:
- **Database:** `portfolio_db`
- **User:** `portfolio_user / portfolio_pass`

### 2. Avvia il Backend

```bash
cd backend
mvn spring-boot:run
```

L'API REST sarà disponibile su **http://localhost:8080**

> Al primo avvio, viene eseguita automaticamente la classe `DataSeeder` che crea:
> - 👑 Admin: `admin@portfolio.com` / `admin123`
> - 👤 Utente: `mario@example.com` / `mario123`
> - 6 prodotti di esempio

### 3. Avvia il Frontend

```bash
cd frontend
npm install
npm run dev
```

L'app React sarà disponibile su **http://localhost:5173**

---

## 🔌 API Endpoints

### Auth
| Method | URL | Descrizione | Auth |
|--------|-----|-------------|------|
| `POST` | `/api/auth/register` | Registrazione nuovo utente | ❌ |
| `POST` | `/api/auth/login` | Login → restituisce JWT | ❌ |

### Products
| Method | URL | Descrizione | Auth |
|--------|-----|-------------|------|
| `GET` | `/api/products` | Lista prodotti (con `?search=` e `?category=`) | ❌ |
| `GET` | `/api/products/{id}` | Dettaglio prodotto | ❌ |
| `POST` | `/api/products` | Crea prodotto | 👑 ADMIN |
| `PUT` | `/api/products/{id}` | Aggiorna prodotto | 👑 ADMIN |
| `DELETE` | `/api/products/{id}` | Elimina prodotto | 👑 ADMIN |

### Orders
| Method | URL | Descrizione | Auth |
|--------|-----|-------------|------|
| `GET` | `/api/orders/my` | I miei ordini | ✅ USER |
| `GET` | `/api/orders` | Tutti gli ordini | 👑 ADMIN |
| `POST` | `/api/orders` | Crea ordine | ✅ USER |
| `PUT` | `/api/orders/{id}/status` | Aggiorna stato ordine | 👑 ADMIN |

---

## 🧪 Test Rapido con cURL

```bash
# 1. Login e ottieni il token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mario@example.com","password":"mario123"}' | python -c "import sys,json; print(json.load(sys.stdin)['token'])")

# 2. Lista prodotti (endpoint pubblico)
curl http://localhost:8080/api/products | python -m json.tool

# 3. Crea un ordine (con JWT)
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'
```

---

## 🗃️ Schema Database

```sql
-- Tabella users
users (id, username, email, password, role, created_at)

-- Tabella products
products (id, name, description, price, quantity, category, image_url, created_at, updated_at)

-- Tabella orders
orders (id, user_id FK, product_id FK, quantity, total_price, status, created_at)
```

Le tabelle vengono generate automaticamente da **Hibernate** con `spring.jpa.hibernate.ddl-auto=update`.

---

## 🔐 Come funziona l'Autenticazione JWT

```
Client                          Server
  │                               │
  │──POST /api/auth/login ────────►│
  │   {email, password}           │  1. Valida credenziali
  │                               │  2. Genera JWT (24h)
  │◄─ {token, user info} ─────────│
  │                               │
  │──GET /api/orders/my ──────────►│
  │   Authorization: Bearer JWT   │  3. JwtAuthFilter valida token
  │                               │  4. Setta SecurityContext
  │◄─ [orders array] ─────────────│
```

---

## 📈 Funzionalità Implementate

- ✅ **CRUD completo** per prodotti (Create, Read, Update, Delete)
- ✅ **Autenticazione JWT** con registrazione e login
- ✅ **Autorizzazione basata su ruoli** (USER / ADMIN)
- ✅ **Gestione degli ordini** con stato (Pending → Delivered)
- ✅ **Riduzione automatica dello stock** alla creazione di un ordine
- ✅ **Ricerca e filtro** prodotti per nome e categoria
- ✅ **Seeding automatico** dei dati demo al primo avvio
- ✅ **CORS** configurato per sviluppo locale
- ✅ **Gestione globale degli errori** con risposte JSON

---

## 👤 Autore

Realizzato come progetto portfolio per dimostrare competenze in:
- Sviluppo backend Java con Spring Boot
- Progettazione di REST API
- Integrazione con database relazionale (MySQL + JPA)
- Sviluppo frontend React con pattern moderni
- Sicurezza applicativa con JWT

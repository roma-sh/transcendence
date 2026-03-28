*This project has been created as part of the 42 curriculum by csteudin, eperperi, jsamardz, rshatra*

# 🏁 §- TRANSCENDENCE -§

> "Surprise, it's a Pong website — but more technical."

---

## 📝 DESCRIPTION

**TRANSCENDENCE** is a full-stack web application developed as the final capstone project of the 42 Common Core. The goal was to build a modern, scalable platform that transforms the classic Pong game into a complete web ecosystem. 

Beyond real-time gameplay, the project integrates advanced user management, multi-layered authentication (OAuth2 & 2FA), a cryptographic tournament history via Blockchain, and a professional-grade monitoring stack. The entire system is fully containerized using **Docker**, ensuring a modular and reproducible infrastructure.

---

## 👥 TEAM INFORMATION

* **csteudin** (Tech Lead): Infrastructure design, Docker orchestration, security auditing (SQLi/XSS), and Remote Auth integration.
* **eperperi** (Product Owner): Core game engine development, AI logic, tournament matchmaking algorithms, and GDPR compliance.
* **jsamardz** (Developer): Blockchain integration for immutable stats, 2FA implementation, and frontend-backend data bridging.
* **rshatra** (Project Manager): Backend API architecture, Database schema management, and overall project coordination.

---

## 📅 PROJECT MANAGEMENT

* **Organization:** We followed an Agile-lite methodology with weekly "Stand-up" meetings every Monday to assess progress and reassign tasks based on module complexity.
* **Workflow:** We utilized **GitHub Issues** for task tracking and a **Pull Request** workflow to ensure code quality through peer review before merging into the main branch.
* **Communication:** * **WhatsApp:** Rapid daily communication and urgent troubleshooting.
    * **Slack:** Professional coordination and formal document sharing.
    * **Google Meet:** Weekly technical syncs and live coding sessions.

---

## 🚀 FEATURES LIST

### **Core Gameplay & AI**
* **Dynamic Pong Engine** *(eperperi)*: High-performance physics-based gameplay featuring adjustable difficulty and responsive controls.
* **Autonomous AI Opponent** *(eperperi)*: Predictive tracking bot with simulated "human error" to allow solo tournament play.
* **Tournament System** *(eperperi, rshatra)*: Automated matchmaking brackets with real-time advancement and persistent score tracking.

### **Security & Authentication**
* **OAuth 2.0 Remote Auth** *(csteudin)*: Third-party Google Login integration for verified user identity management.
* **Multi-Factor Auth (2FA)** *(jsamardz)*: Secondary security layer using **TOTP** protocols (Time-based One-Time Password).
* **Security Hardening** *(csteudin)*: Mitigation of SQL Injection and XSS through parameterized queries and sanitization.

### **Infrastructure & Operations**
* **Monitoring Suite** *(csteudin)*: Real-time telemetry using **Prometheus, Grafana, and cAdvisor**.
* **Blockchain History** *(jsamardz)*: Immutable ledger ensuring cryptographic transparency for tournament results.
* **GDPR Vault** *(eperperi, rshatra)*: Privacy-first management including the "Right to be Forgotten" (account deletion).

---

## 🛠️ TECHNICAL STACK

### **Frontend**
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and mobile-first responsiveness.

### **Backend**
- **Fastify**: High-performance Node.js framework chosen for its low overhead and efficient asynchronous request handling.

### **Database**
- **SQLite**: A relational database chosen for its **serverless architecture** and ease of maintenance, providing robust data integrity without the overhead of a separate DB server.

### **Infrastructure**
- **Docker & Docker Compose**: Full containerization of microservices.
- **Monitoring**: Prometheus (Metrics), Grafana (Visualization), cAdvisor (Container Stats).
- **Blockchain**: Decentralized ledger for verifiable match history.

---

## 📋 DATABASE SCHEMA

The system uses a relational structure. Users are the central entity, linked to match records and tournament brackets.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| **id** | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier for each user. |
| **username** | TEXT | NOT NULL, UNIQUE | User's display name and login handle. |
| **email** | TEXT | NOT NULL, UNIQUE | Primary contact; used for account recovery. |
| **password** | TEXT | NULLABLE | Hashed secret (empty for OAuth-only users). |
| **total_games** | INTEGER | DEFAULT 0 | Counter for player activity statistics. |
| **wins** | INTEGER | DEFAULT 0 | Total matches won by the user. |
| **two_factor_secret**| TEXT | DEFAULT NULL | Encrypted TOTP secret for 2FA. |
| **is_oauth** | INTEGER | DEFAULT 0 | Flag to distinguish login methods. |

---

## 🏗️ FUNCTIONAL MODULES (18 pts)

| Pts | Module Description | Implementation Method | Lead |
| :--- | :--- | :--- | :--- |
| **[2]** | **Backend Framework** | Developed using **Fastify** for high-throughput API routing. | rshatra |
| **[2]** | **Blockchain** | Built an **Immutable Ledger** for verifiable tournament stats. | jsamardz |
| **[2]** | **Remote Auth** | Integrated **OAuth 2.0** (Google) for secure external login. | csteudin |
| **[2]** | **AI Opponent** | Predictive movement logic with "freeze" error-simulators. | eperperi |
| **[2]** | **2FA** | Implementation of **TOTP** via speakeasy/QR-code sync. | jsamardz |
| **[2]** | **User Mgmt** | Full CRUD functionality including account deactivation. | eperperi,rshatra |
| **[1]** | **Monitoring** | Full telemetry via **Prometheus, Grafana & cAdvisor**. | csteudin |
| **[1]** | **GDPR** | Data privacy features including account deletion triggers. | eperperi |
| **[1]** | **Database** | Persistent relational storage using **SQLite**. | rshatra |
| **[1]** | **Frontend** | Responsive design system using **Tailwind CSS**. | old_teamMember |
| **[1]** | **Compatibility** | Standardized Web API usage for cross-device support. | eperperi |
| **[1]** | **Browser Comp.** | Polyfilled features for expanded browser support. | old_teamMember |

---

## ⚙️ INSTRUCTIONS

### **Prerequisites**
- **Docker** & **Docker Compose**
- **Make** utility
- **.env configuration** (Template provided in `/docker/.env`)

### **Installation & Execution**
1.  **Clone the repository:** `git clone <repo_url>`
2.  **Setup Environment:** Run `make setup` and fill in your credentials in the generated `.env` file.
3.  **Launch Project:** Run `make` (This will build and start all containers).
4.  **Access App:** Open `http://localhost:8443` (or your configured port).

### **Useful Commands**
- `make build`: Rebuild containers.
- `make logs-f`: Follow real-time container logs.
- `make fclean`: Full reset (Deletes DB and .env).

---

## 📚 RESOURCES & AI USAGE

### **References**
* **Docker Docs:** Container orchestration and network isolation.
* **Fastify.io:** Asynchronous Node.js patterns.
* **Google Cloud Auth:** OAuth 2.0 implementation guides.
* **Prometheus & Grafana:** Setting up exporters and dashboards.

### **AI Usage Disclosure**
AI tools (Gemini/ChatGPT) were used as follows:
1.  **Debugging Assistance:** Identifying race conditions in real-time game state updates.
2.  **Infrastructure Logic:** Explaining cAdvisor integration with Prometheus.
3.  **Refactoring:** Optimizing Tailwind CSS classes and structuring this README to meet 42 requirements.
4.  **Concept Deep-Dives:** Understanding TOTP math and Blockchain hashing.

*AI was strictly used as a pedagogical and support tool; all core logic was manually implemented by the team.*

---
*Created for the 42 Transcendence Subject - 2026*
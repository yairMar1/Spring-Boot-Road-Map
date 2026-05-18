# Spring Boot Road Map

A 7-day self-guided learning path for Spring Boot — from zero to a full secured REST API with a database.

Each folder contains the source code for that day along with its `pom.xml` so you can see exactly which dependencies were added at each step.

---

## Structure

```
Spring-Boot-Road-Map/
├── Day 1 - Introduction to Spring Boot/
├── Day 2 - Dependency Injection and IoC/
├── Day 3 - Spring MVC and HTTP/
├── Day 4 - Spring Data JPA/
├── Day 5 - Layered Architecture and Errors/
├── Day 6 - Spring Security/
└── Day 7 - Capstone Project/
```

## How to Run

Each day folder contains a `pom.xml` but no Maven wrapper. To open a project:

- **IntelliJ IDEA:** File → Open → select the day's folder → import as Maven project → run the `*Application` main class
- **Command line** (requires Maven installed): `mvn spring-boot:run` from inside the day's folder

---

## Day 1 — Introduction to Spring Boot

> How an app boots and what makes the magic happen

**Concepts:** Spring Boot, Spring vs Spring Boot, Auto-configuration, Convention over Configuration, Starter dependencies, Embedded Tomcat, `@SpringBootApplication`

**Built:** A minimal REST server with a `HelloController` that handles `GET /hello` and `GET /hello/{name}`.

## Day 2 — Dependency Injection and IoC

> Spring manages objects — you just ask for them

**Concepts:** Inversion of Control (IoC), Dependency Injection (DI), ApplicationContext, Bean, `@Component`, `@Service`, `@Repository`, Constructor Injection, `@Autowired`

**Built:** A three-layer greeting chain — `GreetingRepository` → `GreetingService` → `GreetingController` — wired together by Spring using constructor injection (no `new` keyword).

## Day 3 — Spring MVC and HTTP

> An incoming request — how it reaches your code

**Concepts:** Spring MVC, `@RestController`, `@GetMapping` / `@PostMapping`, `@PathVariable`, `@RequestParam`, `@RequestBody`, JSON serialization (Jackson), DTO, `ResponseEntity`

**Built:** A Notes API with a `NoteDTO`, supporting `POST /notes`, `GET /notes`, `GET /notes/{id}`, and filtering by title via `@RequestParam`.

## Day 4 — Spring Data JPA

> Real persistence — a DB without writing SQL

**Concepts:** Spring Data JPA, Hibernate (ORM), `@Entity`, `@Id` / `@GeneratedValue`, `JpaRepository`, CRUD operations, `application.properties`, H2 Console, `@Transactional`

**Built:** A Task Manager backed by an H2 in-memory database. `JpaRepository` provides `save`, `findAll`, `findById`, and `deleteById` with no SQL written. H2 Console enabled for visual inspection.

## Day 5 — Layered Architecture and Errors

> Industry-grade structure for your code

**Concepts:** Layered Architecture, Controller / Service / Repository separation, Separation of Concerns, `@ControllerAdvice`, `@ExceptionHandler`, `@Valid`, `@NotBlank` / `@NotNull`, `ResponseEntity`, Custom exception classes

**Built:** A Task API with strict layer separation — the Controller only handles HTTP, the Service owns all logic. Includes a `TaskNotFoundException`, a `GlobalExceptionHandler` that returns uniform JSON error responses, and `@Valid` input validation.

## Day 6 — Spring Security

> Protect your endpoints — only what's needed

**Concepts:** Spring Security, Authentication vs Authorization, `SecurityFilterChain`, Basic Auth, `permitAll()` / `authenticated()`, Filter chain, CSRF

**Built:** A secured Task API where `GET /tasks` is public and all write operations (`POST`, `PUT`, `DELETE`) require HTTP Basic authentication. Security configured via a `SecurityFilterChain` bean.

## Day 7 — Capstone Project

> Everything together — backend meets frontend

**Concepts:** Full-stack integration, CORS configuration, React + Spring Boot, UUID-based entities, `@ManyToOne` relationships, `@ControllerAdvice`, HTTP Basic Auth for write operations, public GET endpoints, `DataLoader` for seeding, product suggestions

**Built:** A Shopping List app with two parts:
- **Backend:** REST API with `Product` and `Category` entities, full CRUD, search, status tracking, and auto-suggestions. Secured with Spring Security (public reads, auth required for writes).
- **Frontend:** React app (built in Claude.ai) with Hebrew RTL UI, category filtering, search, inline editing, and full API integration.

### Running Day 7

Day 7 is a full-stack project — the backend and frontend run independently.

**Backend (Spring Boot)**
- Open `Day 7 - Capstone Project/` as a Maven project in IntelliJ (File → Open → select the folder)
- Run `ShoppingListApplication` main class
- API runs at `http://localhost:8080`
- Credentials for write operations: `admin` / `1234`

**Frontend (React + Vite)**

Requires [Node.js](https://nodejs.org/) installed.

```bash
cd "Day 7 - Capstone Project/shopping-list-ui"
npm install
npm run dev
```

- UI runs at `http://localhost:5173`
- Start the backend first — the frontend calls `http://localhost:8080`

---

## Stack

- **Java 17**
- **Spring Boot 3**
- **Maven**
- **H2** (in-memory database for learning)

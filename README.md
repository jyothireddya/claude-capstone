# Customer Order Service

Customer Order Service is a REST API used to create, retrieve, update, and cancel customer orders.

## Application Overview

The application provides order management capabilities for internal business applications.

## Technology Stack

- Node.js 20
- Express 4.18.3
- PostgreSQL
- Jest 29.7.0

## Entry Point

The main application entry point is:

`src/index.js`

## API Endpoints

- `GET /orders` — Retrieve customer orders
- `GET /orders/:id` — Retrieve a specific order
- `POST /orders` — Create a customer order
- `PUT /orders/:id` — Update a customer order
- `DELETE /orders/:id` — Cancel a customer order

## Environment Variables

The application requires:

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`

Secret values must be provided through the deployment environment and must not be committed to the repository.

## Database

The application uses PostgreSQL for persistent order data.

## Testing

Jest is used for automated testing.

## Build and Run

Install dependencies:

`npm install`

Start the application:

`npm start`

Run tests:

`npm test`

## Claude Code Agentic SDLC

This project uses Claude Code agents throughout the software development lifecycle.

### Claude Code Configuration

- `CLAUDE.md` — Project-level instructions for Claude Code
- `.claude/agents/` — Specialized SDLC agents
- `.claude/commands/` — Slash commands for each SDLC phase
- `.claude/sdlc-pipeline-status.json` — Pipeline stage tracker

### SDLC Slash Commands

| Command | Purpose |
| --- | --- |
| `/analyze-requirements` | Run the Requirements Analyst |
| `/design-architecture` | Run the Solution Architect |
| `/review-design` | Run the Design Reviewer |
| `/create-implementation-plan` | Run the Implementation Planner |
| `/run-code-review` | Run the Code Reviewer |
| `/verify-solution` | Run the Verification Agent |
| `/prepare-pr` | Run the Pull Request Agent |
| `/documentation-sync` | Synchronize SDLC documentation |

### SDLC Artifacts

| Artifact | Description |
| --- | --- |
| `capstone-user-story.md` | Source user story |
| `requirements.md` | Approved requirements |
| `architecture.md` | Approved architecture |
| `design-review.md` | Design review result |
| `impl-plan.md` | Implementation plan |
| `code-review.md` | Code review result |
| `verification-report.md` | Verification evidence |
| `pull-request.md` | Pull request content |

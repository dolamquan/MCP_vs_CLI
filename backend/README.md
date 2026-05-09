## CLI vs MCP Backend

Express + TypeScript backend for comparing CLI commands against MCP tool calls, estimating token usage and cost, storing comparison history, and exposing both REST and MCP entrypoints.

## Requirements

- Node.js 20+
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
copy .env.example .env
```

3. Generate the Prisma client if needed:

```bash
npm run prisma:generate
```

4. Apply migrations:

```bash
npm run prisma:migrate -- --name init
```

5. Seed pricing data:

```bash
npm run seed
```

## Run Commands

Development API server:

```bash
npm run dev
```

Development MCP server:

```bash
npm run dev:mcp
```

Build the backend:

```bash
npm run build
```

Run the compiled API server:

```bash
npm start
```

Run the compiled MCP server:

```bash
npm run start:mcp
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

## Test Commands

- `npm run test:phase2`
- `npm run test:phase3`
- `npm run test:phase4`
- `npm run test:phase5`
- `npm run test:phase6`
- `npm run test:phase7`
- `npm run test:phase8`
- `npm run test:phase9`
- `npm run test:test_all`
- `npm run test:test-end-to-end`

These scripts assume the backend API is already running on `http://localhost:5000`.

## Available API Endpoints

Base path: `/api`

### Health

- `GET /api/health`

### Comparisons

- `POST /api/comparisons`

### Pricing

- `GET /api/pricing`
- `GET /api/pricing/:modelId`

### History

- `GET /api/history`
- `GET /api/history/:id`
- `DELETE /api/history/:id`

### Reports

- `GET /api/reports/summary`
- `GET /api/reports/chart-data`

### CLI

- `POST /api/cli/run`

### MCP

- `GET /api/mcp/servers`
- `GET /api/mcp/servers/:serverId/tools`
- `POST /api/mcp/call-tool`

### Settings

- `GET /api/settings`
- `PATCH /api/settings`

### Export

- `GET /api/export/history/json`
- `GET /api/export/history/csv`

### Profiler

- `POST /api/profiler/cli`
- `POST /api/profiler/mcp`
- `POST /api/profiler/compare`

### Registry

- `GET /api/registry/mcp-servers`
- `POST /api/registry/mcp-servers`
- `PATCH /api/registry/mcp-servers/:serverId`
- `DELETE /api/registry/mcp-servers/:serverId`
- `GET /api/registry/cli-rules`
- `PATCH /api/registry/cli-rules`
- `GET /api/registry/cli-profiles`
- `POST /api/registry/cli-profiles`
- `PATCH /api/registry/cli-profiles/:profileId`
- `DELETE /api/registry/cli-profiles/:profileId`

### Agent

- `GET /api/agent/health`
- `GET /api/agent/capabilities`
- `POST /api/agent/recommend`

## MCP Tools

The MCP server started with `npm run dev:mcp` or `npm run start:mcp` exposes:

- `advisor_health`
- `advisor_capabilities`
- `advisor_recommend_action`
- `advisor_profile_cli`
- `advisor_profile_mcp`
- `advisor_compare_cli_mcp`

## Folder Structure

```text
backend/
|-- config/
|-- docs/
|-- prisma/
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- database/
|   |-- mcp-tools/
|   |-- routes/
|   |-- services/
|   |-- types/
|   `-- validators/
|-- tests/
|   |-- test_phase_2/
|   |-- test_phase_3/
|   |-- test_phase_4/
|   |-- test_phase_5/
|   |-- test_phase_6/
|   |-- test_phase_7/
|   |-- test_phase_8/
|   `-- test_phase_9/
|-- .env.example
|-- package.json
|-- prisma.config.ts
`-- tsconfig.json
```

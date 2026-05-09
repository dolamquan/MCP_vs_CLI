## CLI vs MCP Backend

Express + TypeScript backend for comparing CLI commands against MCP-style prompts, estimating token usage and cost, storing comparison history, and generating report summaries.

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

## Run

Development server:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Available Endpoints

- `GET /api/health`
- `POST /api/comparisons`
- `GET /api/pricing`
- `GET /api/history`
- `GET /api/history/:id`
- `DELETE /api/history/:id`
- `GET /api/reports/summary`
- `GET /api/reports/chart-data`

## Test Scripts

- `npm run test:phase2`
- `npm run test:phase3`
- `npm run test:phase4`
- `npm run test:phase5`
- `npm run test:phase6`

These scripts assume the backend is already running on `http://localhost:5000`.



POST /api/profiler/compare
        ↓
profiler.controller.ts
        ↓
decisionEngine.service.ts
        ↓
cliProfiler.service.ts      mcpProfiler.service.ts
        ↓                    ↓
cliRunner.service.ts         mcpTool.service.ts
tokenCounter.service.ts      tokenCounter.service.ts
costEstimator.service.ts     costEstimator.service.ts
        ↓                    ↓
return CLI profile           return MCP profile
        ↓
compare total tokens + cost
        ↓
return recommendation
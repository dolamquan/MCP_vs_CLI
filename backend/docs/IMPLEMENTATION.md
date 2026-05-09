# Backend Implementation

This document describes how the backend is currently organized and how requests move through the system.

## Current File Structure

```txt
backend/
|-- config/
|-- docs/
|-- prisma/
|-- src/
|   |-- config/
|   |-- constants/
|   |-- controllers/
|   |-- database/
|   |-- mcp-tools/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- services/
|   |-- types/
|   |-- utils/
|   `-- validators/
|-- tests/
|-- .env.example
|-- package.json
|-- prisma.config.ts
`-- tsconfig.json
```

## Runtime Entry Points

The backend now has two runtime entry points:

- `src/server.ts`
  Starts the Express API server.
- `src/mcpServer.ts`
  Starts the stdio MCP server used by coding agents.

## Request Flow

### REST API Flow

```txt
Client
  |
  v
server.ts
  |
  v
app.ts
  |
  v
routes/
  |
  v
validators/
  |
  v
controllers/
  |
  v
services/
  |
  v
database/repositories/ or MCP/CLI helpers
  |
  v
JSON response
```

### MCP Advisor Flow

```txt
Agent
  |
  v
src/mcpServer.ts
  |
  v
src/mcp-tools/advisor.tools.ts
  |
  v
agentDecision.service.ts / cliProfiler.service.ts / mcpProfiler.service.ts / decisionEngine.service.ts
  |
  v
MCP tool response
```

## Main Source Areas

- `src/routes/`
  Declares REST endpoints mounted under `/api`.
- `src/controllers/`
  Handles HTTP request and response orchestration.
- `src/services/`
  Contains business logic for comparison, profiling, history, reporting, registry updates, and agent recommendations.
- `src/database/`
  Provides database setup and repository access.
- `src/config/`
  Holds runtime configuration, MCP registry loading, and JSON-backed config helpers.
- `src/mcp-tools/`
  Registers MCP advisor tools and their input schemas.
- `src/types/`
  Shared TypeScript contracts for controllers, services, and profiler results.
- `src/validators/`
  Validates request payloads and route params.

## Mounted REST Routes

The main router in `src/routes/index.routes.ts` mounts:

- `/api/health`
- `/api/comparisons`
- `/api/pricing`
- `/api/history`
- `/api/reports`
- `/api/cli`
- `/api/mcp`
- `/api/settings`
- `/api/export`
- `/api/profiler`
- `/api/registry`
- `/api/agent`

## MCP Advisor Tools

The MCP server registers these tools in `src/mcp-tools/advisor.tools.ts`:

- `advisor_health`
- `advisor_capabilities`
- `advisor_recommend_action`
- `advisor_profile_cli`
- `advisor_profile_mcp`
- `advisor_compare_cli_mcp`

## Implementation Phases

### Phase 1: Boot the API

Initial backend startup and health check support.

```txt
src/
|-- server.ts
|-- app.ts
|-- routes/
|   |-- index.routes.ts
|   `-- health.routes.ts
`-- controllers/
    `-- health.controller.ts
```

Result:

- `GET /api/health`

### Phase 2: Core Comparison Logic

Token counting, cost estimation, and recommendation logic for comparing CLI and MCP-style actions.

```txt
src/
|-- services/
|   |-- tokenCounter.service.ts
|   |-- costEstimator.service.ts
|   |-- recommendation.service.ts
|   `-- comparison.service.ts
|-- utils/
|   |-- calculateSavings.ts
|   |-- formatCost.ts
|   `-- safeJsonParse.ts
`-- types/
    |-- comparison.types.ts
    |-- pricing.types.ts
    `-- recommendation.types.ts
```

### Phase 3: Comparison API

Expose comparison logic through a REST endpoint.

```txt
src/
|-- routes/
|   `-- comparison.routes.ts
|-- controllers/
|   `-- comparison.controller.ts
`-- validators/
    `-- comparison.validators.ts
```

### Phase 4: Pricing Support

Load and serve model pricing used by token cost calculations.

```txt
src/
|-- routes/
|   `-- pricing.routes.ts
|-- controllers/
|   `-- pricing.controller.ts
|-- services/
|   `-- pricing.service.ts
|-- validators/
|   `-- pricing.validator.ts
`-- config/
    `-- pricing.config.ts
```

### Phase 5: Database and History

Persist comparisons and retrieve historical runs.

```txt
prisma/
|-- schema.prisma
`-- seed.ts

src/
|-- database/
|   |-- db.ts
|   `-- repositories/
|       |-- comparison.repository.ts
|       `-- pricing.repository.ts
|-- routes/
|   `-- history.routes.ts
|-- controllers/
|   `-- history.controller.ts
`-- services/
    `-- history.service.ts
```

### Phase 6: Reports and Export

Summaries, chart-friendly output, and downloadable history exports.

```txt
src/
|-- routes/
|   |-- reports.routes.ts
|   `-- export.routes.ts
|-- controllers/
|   |-- reports.controller.ts
|   `-- export.controller.ts
|-- services/
|   |-- reports.service.ts
|   |-- chartData.service.ts
|   `-- export.service.ts
`-- database/
    `-- repositories/
        `-- report.repository.ts
```

### Phase 7: CLI and MCP Execution

Run safe CLI commands and inspect configured MCP servers and tools.

```txt
src/
|-- routes/
|   |-- cli.routes.ts
|   `-- mcp.routes.ts
|-- controllers/
|   |-- cli.controller.ts
|   `-- mcp.controller.ts
|-- services/
|   |-- cliRunner.service.ts
|   |-- cliSafety.service.ts
|   |-- mcpClient.service.ts
|   |-- mcpTool.service.ts
|   `-- mcpProfiler.service.ts
|-- validators/
|   |-- cli.validator.ts
|   `-- mcp.validator.ts
`-- config/
    |-- cliSafety.config.ts
    `-- mcp.config.ts
```

### Phase 8: Profiling and Decision Engine

Add explicit profiling endpoints and direct CLI-vs-MCP comparison using real request and result token counts.

```txt
src/
|-- routes/
|   `-- profiler.routes.ts
|-- controllers/
|   `-- profiler.controller.ts
`-- services/
    |-- cliProfiler.service.ts
    |-- mcpProfiler.service.ts
    |-- tokenProfiler.service.ts
    |-- profilerTransformer.service.ts
    `-- decisionEngine.service.ts
```

Result:

- `POST /api/profiler/cli`
- `POST /api/profiler/mcp`
- `POST /api/profiler/compare`

### Phase 9: Dynamic Registry and Agent Support

Store editable MCP server configs and CLI rules in JSON files, then expose agent-oriented endpoints that can recommend actions across multiple candidates.

```txt
src/
|-- routes/
|   |-- registry.routes.ts
|   `-- agent.routes.ts
|-- controllers/
|   |-- registry.controller.ts
|   `-- agent.controller.ts
|-- services/
|   |-- jsonFile.service.ts
|   |-- mcpRegistry.service.ts
|   |-- cliRegistry.service.ts
|   |-- agentContext.service.ts
|   |-- agentDecision.service.ts
|   `-- agentResponse.service.ts
|-- types/
|   |-- registry.types.ts
|   `-- agent.types.ts
`-- config/
    |-- mcp-servers.json
    |-- cli-rules.json
    `-- cli-profiles.json
```

Result:

- Registry endpoints under `/api/registry`
- Agent endpoints under `/api/agent`

### Phase 10: MCP Advisor Server

Expose the backend recommendation and profiling logic as MCP tools for external coding agents.

```txt
src/
|-- mcpServer.ts
`-- mcp-tools/
    |-- advisor.tools.ts
    `-- advisor.schemas.ts
```

This layer reuses the existing backend services instead of duplicating logic.

## Notes

- The REST API and MCP server share the same service layer.
- Registry state is JSON-backed, which makes local iteration easy without changing core service code.
- The MCP advisor is designed as a thin wrapper around existing profiling and recommendation services.

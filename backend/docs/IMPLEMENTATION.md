
Backend:

# File Structure

tokenlens-backend/
├── src/
│   ├── server.ts - Responsible for starting the backend server
│   ├── app.ts - Responsible for creating and configuring the Express App
│   │
│   ├── config/ - Responsible for configuration settings --> keeps setup values separate from business logic
│   ├── routes/ - Defining API endpoints
│   ├── controllers/ - Handling request and response logic --> "middle manager"
│   ├── services/ - Actual business logic
│   ├── database/ - Database access
│   ├── models/ - Describing the structure of the data
│   ├── middleware/ - Logic that runs before or after requests
│   ├── validators/ - Validating input schemas
│   ├── utils/ - Utility functions
│   ├── types/ - Type definitions
│   └── constants/ - Fixed values
│
├── prisma/ - Prisma database schema and seeding
├── tests/ - Testing backend logic
├── docs/ - Documentation
├── .env
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md


# Backend Flow

Frontend
   ↓
server.ts
   ↓
app.ts
   ↓
routes/
   ↓
controllers/
   ↓
validators/
   ↓
services/
   ↓
database/repositories/
   ↓
database


## Design Phases:

### Phase 1: Make the Backend Run -> Health check
src/
├── server.ts
├── app.ts
├── routes/
│   ├── index.routes.ts
│   └── health.routes.ts
└── controllers/
    └── health.controller.ts

- Goal: GET /api/health

### Phase 2: Build Core Comparison Logic

src/
├── services/
│   ├── tokenCounter.service.ts
│   ├── costEstimator.service.ts
│   ├── recommendation.service.ts
│   └── comparison.service.ts
│
├── utils/
│   ├── calculateSavings.ts
│   ├── formatCost.ts
│   └── safeJsonParse.ts
│
└── types/
    ├── comparison.types.ts
    ├── pricing.types.ts
    └── recommendation.types.ts

### Phase 3: Implement Comparison API

src/
├── routes/
│   └── comparison.routes.ts
│
├── controllers/
│   └── comparison.controller.ts
│
└── validators/
    └── comparison.validator.ts


### Phase 4: Add Model Pricing

src/
├── routes/
│   └── pricing.routes.ts
│
├── controllers/
│   └── pricing.controller.ts
│
├── services/
│   └── pricing.service.ts
│
├── validators/
│   └── pricing.validator.ts
│
└── config/
    └── pricing.config.ts


### Phase 5: Add database and History

prisma/
├── schema.prisma
└── seed.ts --> puts starter data into the database

src/
├── database/
│   ├── db.ts
│   └── repositories/ --> responsible for talking directly to the database 
│       ├── comparison.repository.ts
│       └── pricing.repository.ts
│
├── routes/
│   └── history.routes.ts
│
├── controllers/
│   └── history.controller.ts
│
└── services/
    └── history.service.ts


### Phase 6: Add reports

src/
├── routes/
│   └── reports.routes.ts
│
├── controllers/
│   └── reports.controller.ts
│
├── services/
│   ├── reports.service.ts
│   └── chartData.service.ts
│
└── database/
    └── repositories/
        └── report.repository.ts
# CampusTracker — Multi-College SaaS Architecture Specification

**Document Version**: `3.0.0`  
**Status**: APPROVED SAAS ARCHITECTURE  
**Target Capability**: Multi-College Tenant Isolation & Enterprise Scalability  

---

## 1. Executive Summary & SaaS Isolation Model

The CampusTracker Multi-College SaaS Architecture guarantees complete data, connector, and operational isolation across hundreds of higher education institutions.

Every college independently configures its own connectors, dataset mappings, polling frequencies, authentication credentials, departments, and academic structures without affecting any other institution on the shared platform.

---

## 2. Multi-Tenant Data & Connector Isolation

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              MULTI-COLLEGE SAAS TENANT ISOLATION                       │
│                                                                                        │
│ ┌──────────────────────────────────┐        ┌──────────────────────────────────┐       │
│ │ TENANT A: MIT COLLEGE OF ENG.    │        │ TENANT B: COEP TECHNOLOGICAL UNIV│       │
│ │ Institution ID: inst-mit-uuid    │        │ Institution ID: inst-coep-uuid   │       │
│ │ Subdomain: mit.campustracker.edu │        │ Subdomain: coep.campustracker.edu│       │
│ │ Connectors: Google Sheets + ERP  │        │ Connectors: Cloud Excel + SQL DB │       │
│ └─────────────────┬────────────────┘        └─────────────────┬────────────────┘       │
│                   │                                           │                        │
│                   ▼                                           ▼                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ SUPABASE MULTI-TENANT POSTGRES (Row Level Security Enforced by `institution_id`)    │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **JWT Tenant Claims**: Every user token contains `institution_id` and `role`.
- **RLS Policy Enforcement**: Database queries automatically append `WHERE institution_id = auth.jwt() ->> 'institution_id'`.
- **Isolated Connector Polling**: Background workers execute connector jobs scoped by tenant ID, preventing cross-college rate-limiting or credential bleed.

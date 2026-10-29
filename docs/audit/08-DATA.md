# 08 — Data Architecture & Integrity

## Data Flow & Storage Topology

```mermaid
erDiagram
    resources ||--o{ resource_tags : has
    tags ||--o{ resource_tags : classifies
    resources ||--o| prompts : extends
    resources ||--o| tools : extends
    resources ||--o| workflows : extends
    resources ||--o| agents : extends
    workflows ||--o{ workflow_steps : contains
    workflows ||--o{ workflow_resources : references
    resources ||--o{ resource_relationships : relates_from
    resources ||--o{ resource_relationships : relates_to

    resources {
        string id PK
        string type
        string title
        string description
        string slug UK
        int featured
        string origin
        int favorite
        string created_at
        string updated_at
    }

    tools {
        string resource_id PK,FK
        string url
        string hostname
        string kind
        string category
        string pricing
        string notes
        string verified_at
    }

    prompts {
        string resource_id PK,FK
        string content
        string model
        int favorite
    }

    workflows {
        string resource_id PK,FK
        string purpose
        string status
        string difficulty
        string estimated_time
        string notes
    }

    agents {
        string resource_id PK,FK
        string role
        string goal
        string instructions
        string runtime
        string model
        string status
        string autonomy_level
        string input_description
        string output_description
        string notes
    }
```

---

## Data Integrity Evaluation

1. **Foreign Key Enforcement:**
   - Schema defines `ON DELETE CASCADE` across `prompts`, `tools`, `workflows`, `agents`, and join tables (`resource_tags`, `resource_relationships`).
   - SQLite requirement: Must execute `PRAGMA foreign_keys = ON;` per D1 connection to ensure cascading deletes execute properly.
2. **Referential Cycles:**
   - `resource_relationships` allows arbitrary resource-to-resource directed graph relationships (`from_resource_id`, `to_resource_id`, `relationship_type`).
   - No cyclic dependency detection exists at application layer; cycles are tolerated since relationships represent an open knowledge graph.
3. **Data Loss / Truncation Risks:**
   - Text fields are SQLite `TEXT`, which accommodates variable-length UTF-8 strings.
   - However, application layer does not enforce maximum string lengths on incoming JSON bodies, exposing D1 to payload truncation or memory exhaustion if unvalidated multi-megabyte payloads are submitted.

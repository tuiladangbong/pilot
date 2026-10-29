# 15 — Coding Standards & Engineering Conventions

## Style & Standards Evaluation

### 1. Style Consistency
- **Formatting:** Clean 2-space indentation, semicolons, single-quoted strings, standard ES module syntax.
- **Linters:** No `.eslintrc` or `biome.json` is currently committed in the repository.
- **Finding:** While formatting is currently neat and readable, absence of an automated CI linter (e.g. Biome or ESLint) means style consistency depends entirely on developer discipline.

### 2. Error Handling Standards
- **Use Cases:** Throw descriptive standard errors (`throw new Error('Title is required')`).
- **HTTP Adapter:** Catches use case errors and maps them to standard JSON errors:
  ```json
  {
    "ok": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Title is required"
    }
  }
  ```
- **Inconsistency:** In several router handlers, errors are caught with untyped `catch (err: any) { return jsonError('CREATION_ERROR', err.message, 400); }`, occasionally leaking raw database error messages or internal JavaScript errors to the client.

### 3. Recommended Standards Actions
- Add a lightweight `biome.json` or `prettier` config with pre-commit hook.
- Define a unified domain `AppError` hierarchy (`ValidationError`, `NotFoundError`, `UnauthorizedError`, `ConflictError`) with explicit HTTP status code mappings.

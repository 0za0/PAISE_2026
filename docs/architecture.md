# Architecture & Design – Modern Software Engineer Simulator

Status: Proposed for Phase 2 | 22 November 2026

## 1. Requirements first

The game is a single-player browser-based idle/clicker game. MUST: US-01 manual clicks and upgrades; US-02 generators and escalating purchase prices; US-03 technical debt, TPS penalties and refactoring; US-10 achievements, autosave and capped offline progress. SHOULD: US-04 incidents, US-05 energy/burnout, US-06 technology trends, US-09 exit/equity. COULD: US-07 code review and US-08 compute/rate limits.

Quality goals: understandable architecture, no server operations for the MVP, testable calculations, responsive browser UI, reliable local persistence, clear state transitions, and safe handling of invalid saved data. No login, multiplayer, online leaderboard or shared economy is required.

## 2. Architecture alternatives

| Criterion | A: Client-side modular monolith | B: Backend-driven web app |
|---|---|---|
| Structure | UI, game engine and persistence in browser | Browser UI + HTTP API + server engine + database |
| Benefits | Simple, low cost, offline-capable, no API deployment | Central save data, device sync, authoritative rules |
| Drawbacks | Saves tied to browser; cheating possible; local storage can be cleared | Hosting costs, authentication, API security and more development effort |
| Fits MUST stories | Yes, all four | Yes, but adds complexity without a current requirement |
| Extensions | Can add API later at persistence boundary | Appropriate if multiplayer/accounts later become necessary |

**Decision: A, client-side modular monolith.** All current MUST requirements concern one player's local state. A backend would not materially improve the MVP. Do not introduce microservices, queues or a remote database.

## 3. Technology choices

- **TypeScript:** typed state, easier refactoring and unit testing of formulas.
- **React + Vite:** component UI and lightweight development/build workflow. Plain TypeScript would also work; React is selected for UI composition, not because it is mandatory.
- **Game engine:** pure TypeScript functions, separate from React (testable without browser).
- **Browser storage:** `localStorage` with a versioned JSON save; no database in MVP. Trade-off: limited size and not synchronized across devices.
- **Vitest:** unit tests for pricing, TPS, debt, saves and transitions.
- **Deployment:** static hosting; compare options in `hosting.md`.

These are proposed choices pending confirmation against the actual existing repository: **do not replace an existing framework without checking it first**.

## 4. Component architecture

See [architecture-diagram.md](architecture-diagram.md) for the C4-inspired diagram (Mermaid).

- **UI components:** editor, resource header, generator shop, debt panel, achievements and optional event dialogs. Display state and dispatch actions; no business calculations.
- **Game controller/store:** owns `GameState`; accepts user actions; emits updated state to UI.
- **Game engine:** pure operations for click, buy generator, compute production, advance simulation, debt thresholds, refactor and unlock achievements.
- **Configuration:** generator types, prices, upgrade effects, achievements and incident types.
- **Persistence adapter:** validates, serializes, versions, saves and loads state; computes bounded offline progress.
- **Clock:** supplies elapsed time for updates; tests inject a fake clock. Use a single time-based simulation to prevent duplicate TPS rewards.

**Main flow:** click -> UI action -> controller -> game engine -> new state -> UI update; save -> persistence adapter -> browser localStorage. All UI actions go through the controller. A background tick advances passive production and debt using elapsed time.

## 5. Data model

| Entity / type | Key properties | Relationship |
|---|---|---|
| `GameState` | `schemaVersion`, `tokens`, `totalEarned`, `lastSimulatedAt`, `lastSavedAt`, `runNumber` | Root state, includes collections below |
| `GeneratorDefinition` | `id`, `name`, `basePrice`, `baseTps`, `debtPerSecond`, `priceGrowth` | Static config, referenced by owned generators |
| `OwnedGenerator` | `generatorId`, `quantity` | Many per GameState; generatorId points to definition |
| `UpgradeDefinition` | `id`, `price`, `effects` | Static config; purchased IDs stored in GameState |
| `TechnicalDebt` | `level` (0–100), `refactoringEndsAt` | One state object per run |
| `AchievementDefinition` | `id`, `criterion`, `label` | Static config; unlocked IDs stored in GameState |
| `ActiveEvent` | `id`, `type`, `startedAt`, `endsAt`, `status` | Optional events per run (SHOULD) |
| `PrestigeState` | `equity`, `permanentUpgradeIds` | Survives run reset (SHOULD) |

Suggested persisted JSON example:

```json
{
  "schemaVersion": 1,
  "tokens": 120.5,
  "totalEarned": 240.5,
  "lastSimulatedAt": 1795374000000,
  "lastSavedAt": 1795374000000,
  "runNumber": 1,
  "ownedGenerators": [{"generatorId": "junior", "quantity": 2}],
  "purchasedUpgradeIds": ["keyboard"],
  "technicalDebt": {"level": 18, "refactoringEndsAt": null},
  "unlockedAchievementIds": ["first-100"],
  "prestige": {"equity": 0, "permanentUpgradeIds": []}
}
```

All costs and rates derive from immutable definitions; no need to persist duplicate TPS fields. Validate IDs, numeric bounds and schema version on load. Timestamps above are illustrative.

## 6. Interfaces / API design

**Chosen architecture has no network REST API.** The relevant APIs are typed module interfaces between UI and game engine. This avoids inventing endpoints that will not be implemented.

| Operation | Signature | Effect / response |
|---|---|---|
| Click | `dispatch({type: 'CLICK'})` | Increase tokens by effective click power |
| Buy generator | `dispatch({type: 'BUY_GENERATOR', generatorId: string})` | Check balance, deduct price, increment quantity; otherwise return error |
| Refactor | `dispatch({type: 'START_REFACTOR'})` | Schedule temporary production penalty and debt reduction |
| Tick | `advance(state, nowMs): GameState` | Compute TPS, earned tokens and debt from elapsed time |
| Save | `save(state): Result<void, SaveError>` | Persist versioned JSON in localStorage |
| Load | `load(): Result<GameState, LoadError>` | Validate saved state or use safe defaults |

Example input: `{ "type": "BUY_GENERATOR", "generatorId": "junior" }`.
Example result: `{ "ok": false, "error": "INSUFFICIENT_TOKENS" }`.
Error codes: `INSUFFICIENT_TOKENS`, `UNKNOWN_GENERATOR`, `INVALID_STATE`, `REFACTOR_ALREADY_ACTIVE`, `STORAGE_UNAVAILABLE`.

**Potential future REST API (not part of MVP):** `GET /api/v1/save` (200 GameState), `PUT /api/v1/save` (validated GameState, 200/400), `POST /api/v1/actions` (Action -> updated state), authenticated per user. Do not implement unless synchronization or accounts are actually required. Server authority would then replace browser-only trusted state.

## 7. Non-functional considerations and risks

- **Security:** no secrets in client code; do not execute arbitrary code from saves; parse and validate JSON; use framework escaping for dynamic strings. Browser saves are not tamper-proof; acceptable for local single-player.
- **Performance:** compute TPS once per engine update; use elapsed milliseconds, not a fixed reward per timer callback; avoid unnecessary React rerenders; cap long offline intervals.
- **Maintainability:** domain logic independent of UI, data-driven generators, small modules, unit tests for thresholds and edge cases.
- **Reliability:** save atomically as one JSON value, catch quota/parse exceptions, enforce state schema version and migration or safe reset strategy. Warn users that clearing site data removes local progress.
- **Correctness:** define how debt penalties, incidents and refactoring stack; ensure refactoring finishing while offline does not double-award tokens.

## 8. Critical evaluation of AI proposals

AI was used to consider two variants and identify trade-offs. A backend-plus-database architecture is often suggested by AI for games to support login and synchronization. **Rejected for this MVP:** there is no account, multiplayer or multi-device requirement, and an API increases scope, hosting, and security burden. A second AI risk is the naive `setInterval(() => tokens += TPS)` pattern: browsers throttle background timers, leading to inaccurate production. **Mitigation:** calculate production from elapsed timestamps and test simulated time jumps. A third risk is assuming `localStorage` is a secure database: it is editable and can be deleted, which is explicitly acceptable only because the game is local single-player.

AI output is a proposal, not an implementation guarantee. Confirm the repository's current framework before adopting tools. Team must review formulas and cost assumptions and document adjustments.

## 9. Traceability / Implementation order

| Requirement | Components / interface |
|---|---|
| US-01 | Editor -> `CLICK` -> engine, upgrade configuration |
| US-02 | Generator shop -> `BUY_GENERATOR`, definitions, TPS engine |
| US-03 | Debt panel -> `START_REFACTOR`, debt engine |
| US-10 | Achievements evaluator, persistence adapter, `advance` offline handling |
| US-04–09 | Optional event/energy/trend/review/compute/prestige modules using same state/action interface |

Implement and test US-01/02/03/10 first. Remaining stories are extensions of the same architecture. See [ADR 001](adr/001-client-side-architecture.md) and [ADR 002](adr/002-local-persistence.md).

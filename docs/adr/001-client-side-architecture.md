# ADR 001 – Client-side modular monolith instead of backend architecture

Date: 2026-11-22
Status: Accepted for MVP (proposed; team confirmation required)

## Context
US-01/02/03/10 require a single-player clicker, generators, debt and persistence. Accounts, multiplayer, cross-device sync and server-authoritative gameplay are not specified. Time is limited.

## Options
1. **Client-side modular monolith:** browser UI, typed game engine and local persistence.
2. **Backend-driven app:** frontend plus REST API, persistent server and database.

## Decision
Select option 1 for the MVP. Keep clear module boundaries so persistence can be replaced by an API later if requirements change.

## Consequences
**Positive:** fewer components, no backend operations, static free-tier hosting, offline use, direct unit testing.
**Negative:** local saves may be manipulated, deleted or unavailable across devices. An online multiplayer feature would require substantial redesign.

## AI review
An AI-proposed server database would support hypothetical scaling but overengineer these requirements. The team rejects it until a real networked requirement is added.

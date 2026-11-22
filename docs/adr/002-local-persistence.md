# ADR 002 – Versioned localStorage save file

Date: 2026-11-22
Status: Accepted for MVP (proposed; team confirmation required)

## Context
US-10 requires autosave and capped offline progress. No cross-device synchronization is required. Persistent game state is small and serializable.

## Options
1. Browser `localStorage` with one versioned JSON snapshot.
2. IndexedDB for asynchronous structured storage.
3. Remote server database.

## Decision
Use versioned JSON in `localStorage` for MVP. Store `schemaVersion`, game data, timestamps and achievement IDs; derive TPS from configuration and owned generators. Validate on load and recover gracefully on failure. Calculate offline gains from elapsed time with an explicit cap (proposed: eight hours).

## Consequences
**Positive:** very simple, synchronous API, no backend, easy testing and deployment.
**Negative:** storage can be cleared or modified, size is limited, API may be blocked in restricted browsing modes, origin changes do not carry saves. IndexedDB is preferable if data grows large.

## AI review
A naive AI approach that saves only the token balance or awards a fixed TPS on each timer tick is incorrect: it loses generator/debt context and miscalculates background time. Persist full state and use elapsed timestamps. The precise offline debt/event model must be tested before implementation.

# Architecture diagram (C4-inspired component view)

```mermaid
flowchart TD
    Player[Player] --> UI[Browser UI - React components]
    subgraph Browser[Browser application - modular monolith]
      UI --> Store[Game Controller / State Store]
      Store --> Engine[Pure TypeScript Game Engine]
      Store --> Save[Persistence Adapter]
      Engine --> Config[Generator / Upgrade / Achievement Definitions]
      Engine --> Clock[Clock / Elapsed Time]
    end
    Save --> Storage[(Browser localStorage - versioned JSON)]
```

**Legend:** All components execute in the user's browser. Arrows represent calls/data dependencies, not HTTP requests. `Store` coordinates actions and update ticks; `Engine` owns rules; `Save` reads/writes only localStorage. No backend or database server is needed for the MVP. Keep this diagram aligned with the actual project as implementation progresses.

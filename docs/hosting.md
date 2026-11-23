# Hosting comparison – Modern Software Engineer Simulator

Status: Phase 2 proposal | researched 22 November 2026

## Requirements
Static files (HTML/CSS/JavaScript built from TypeScript/React), HTTPS, simple deployment from Git, minimal cost. There is no server API or remote database in the chosen architecture. Saves remain in the player's browser.

| Option | Entry-level hosting cost | Strengths | Limitations |
|---|---|---|---|
| **GitHub Pages** | **€0 for public repositories on GitHub Free** | Very simple integration with existing GitHub repository, HTTPS, sufficient for a static game | Public-repo limitation on Free plan; build/deploy workflow may need configuration; no server-side game state |
| **Cloudflare Pages** | **€0 Free plan within limits** | Git integration, CDN, HTTPS, preview deployments | Provider account, free-plan usage/deployment limits; optional server functions have separate quotas |
| **Netlify** | **€0 Free plan within credits/usage limits** | Git deployment, previews and simple rollback | Credit-based usage limits, account management, optional paid upgrade |
| **Self-managed VPS** | **Generally paid (provider dependent)** | Full control, supports future backend | OS updates, security, certificates, monitoring; unnecessary for static MVP |

**Decision:** GitHub Pages if the repository is hosted publicly on GitHub and the team wants the least operational overhead. Otherwise Cloudflare Pages is a practical alternative for a private source repository with a public deployment. Both require confirming current quotas and repository permissions.

**Illustrative semester budget:** static app hosting €0/month within free tiers, €0 database, €0 backend. Optional custom domain and exceeding free-tier quotas can add costs. For a VPS no reliable fixed price is quoted because provider, region and resources have not been selected.

## Deployment considerations
- Build static assets with the existing build command (e.g. `npm run build` for Vite).
- For GitHub Pages, ensure Vite `base` matches the repository subpath, or deploy to a custom domain.
- HTTPS is provided by hosting. No API secrets required.
- Check that refreshing a nested client-side route works (use hash routing or a suitable fallback if needed).
- LocalStorage is scoped to origin: changing deployment domain can make an existing save appear missing.

## Official sources (checked 2026-11-22)
- GitHub Pages overview: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- GitHub Pages limitations: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Netlify pricing: https://www.netlify.com/pricing/

Prices/plans can change; verify before deployment.

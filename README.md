# Jesse Koeppel — Portfolio

An Astro static website with Markdown project case studies.

## Development

Use Node.js 22 and npm.

```sh
npm install
npm run dev
npm run build
npm run preview
```

The initial scaffold has no committed dependency lockfile; generate and review package-lock.json before switching CI to npm ci.

## Content

- Edit `src/content/projects/*.md` for project summaries and case studies.
- Edit `src/pages/about.astro` for biographical material.
- Edit CSS variables in `src/styles/global.css` for the palette and type system.
- The thumbnail drawings are conceptual, not measured data.
- See `docs/content-plan.md` for the editorial checklist.

## Hosting

In repository Settings > Pages, set Source to GitHub Actions. The workflow builds on PRs and deploys only on main or manual dispatch from main. Review the draft content before merging. Site URL: https://dharklol.github.io/.

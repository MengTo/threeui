# ThreeUI Community

> **Sponsor ThreeUI:** Linked README placements start at $500/month, with website placements from $1,500/month. [View sponsorship plans](https://threeui.com/sponsorship).

The open-source, login-free edition of ThreeUI. It uses the same application shell, layout, navigation, browse grid, search, themes, responsive behavior, component pages, live renderers, controls, variant picker, and source tabs as the main project.

The catalog is the only product-level difference: Pro and Beta components are removed. Every Community component keeps all of its free variants and controls.

[Browse ThreeUI](https://threeui.com) · [View the source on GitHub](https://github.com/MengTo/threeui)

![ThreeUI Community preview](assets/preview.jpg)

## Sponsor ThreeUI

Sponsorship keeps the open-source Community library maintained and puts your product in front of ThreeUI's developer audience. Website traffic is currently estimated at roughly 90,000 views per day as of 26 August 2026; this is directional traffic context, not a guarantee of sponsor impressions, clicks, or results.

| Plan | Price | Placement and involvement |
| --- | ---: | --- |
| Ecosystem Sponsor | $500/month | Linked banner near the top of the public GitHub README, plus a thank-you credit in this sponsorship section. Up to 6 sponsors. |
| Featured Sponsor | $1,500/month | Everything in Ecosystem, plus a small linked banner in the ThreeUI website documentation sidebar. Up to 2 sponsors. |
| Ultimate Sponsor | $3,000/month | Both banner placements, one approved fixed-scope integration project per agreement, and priority consideration for maintenance needs, sponsor feedback, and reasonable special requests. All work is mutually agreed in writing. |

[See the complete sponsorship details](https://threeui.com/sponsorship) or email [support@designcode.io](mailto:support@designcode.io?subject=ThreeUI%20sponsorship). Sponsorship does not guarantee roadmap changes, editorial control, exclusivity, or private support.

## Included

- 50 Community parent components
- 111 Community routes
- 141 free variant records, plus 23 singleton components (164 browse results)
- Complete Community implementation source and required assets
- No authentication, account state, checkout runtime, Pro implementation, or Beta implementation
- `Get Pro` links to `https://threeui.com/pricing`

## Run locally

```bash
npm install
npm run dev
```

Or deploy it hosted, without cloning anything:

[![Deploy on InstaPods](https://instapods.com/deploy-button.svg)](https://app.instapods.com/dashboard/pods/create?repo=https://github.com/MengTo/threeui&ref=gh-threeui)

Run the complete publication boundary, type, and production-build checks:

```bash
npm run build
```

## Install the React package

Install the public Community component library from npm:

```bash
npm install @designcodeio/threeui
```

Import a component and the shared styles:

```tsx
import { AtTheHorizon } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Hero() {
  return <AtTheHorizon />;
}
```

For the smallest development import graph, use a component subpath:

```tsx
import { AtTheHorizon } from "@designcodeio/threeui/components/AtTheHorizon";
```

Components that render full HTML documents expect their runtime files at the same root-relative URLs used by the ThreeUI preview. Copy the needed files from `node_modules/@designcodeio/threeui/lib-dist/assets/` into your app's public directory, or override the component's `sourceUrl` or `assetBaseUrl` prop where available.

## Pro source access

Pro implementation source is deliberately not published to npm. Active ThreeUI Pro members authenticate through the browser and download an entitled source bundle with the public CLI:

```bash
npx @designcodeio/threeui-cli add cross-beam
```

The CLI uses OAuth with PKCE, stores its refreshable session with owner-only permissions, checks the account entitlement on every server request, and refuses to overwrite changed project files unless `--force` is supplied. Run `npx @designcodeio/threeui-cli --help` for login, logout, destination, and development endpoint options.

## Synchronization

The checked-in repository runs independently. Maintainers can refresh its Community subset from a separately held main-project snapshot:

```bash
npm run sync:community -- /path/to/main-threeui
```

The sync fails closed, filters Pro and Beta before generating the public import graph, preserves all free metadata and options, removes restricted font assets, and writes:

- `public/community-sync-report.json` — counts plus per-component variant/control parity
- `public/source-code.json` — Community source bundles used by the Code tab
- `src/data/shaders.tsx` — Community-only catalog and renderer imports

The private ThreeUI repository runs this synchronization after every successful push to `main`. A no-op sync exits without a release. Changes update the `automation/community-sync` branch and open one reviewed pull request here. New public components, variants, or controls infer a minor release; removals infer a major release; compatible source changes infer a patch release. Merging a versioned sync pull request publishes the new package through npm trusted publishing with provenance.

The public workflow also runs a clean build, boundary audit, package creation, and anonymous installation smoke test before release. The Pro installer is versioned and published separately; changes to Pro component content do not require a CLI release.

## License

Application code, Community component code, and ThreeUI-authored Community imagery are MIT licensed. Bundled open fonts remain under the SIL Open Font License 1.1, and bundled Three.js runtime files remain MIT licensed. Remote catalog thumbnails and previews loaded from `https://threeui.com` are not redistributed by this repository. See `ASSET-LICENSES.md`, `FONT-LICENSES.md`, and `THIRD_PARTY_NOTICES.md`.

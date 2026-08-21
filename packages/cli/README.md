# @designcodeio/threeui-cli

ThreeUI Pro members use this CLI to download entitled component source into their project. Authentication happens in the browser through ThreeUI's OAuth server; npm never contains the Pro source.

```bash
npx @designcodeio/threeui-cli add cross-beam
```

The first run opens the ThreeUI sign-in and consent screen. The CLI stores the resulting OAuth session in the operating system's user config directory with owner-only permissions and refreshes it when needed.

```bash
npx @designcodeio/threeui-cli login
npx @designcodeio/threeui-cli logout
npx @designcodeio/threeui-cli add terrain-plume --dir ./src --force
```

Run `npx @designcodeio/threeui-cli --help` for all options.

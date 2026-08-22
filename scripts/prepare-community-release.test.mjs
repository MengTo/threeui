import assert from "node:assert/strict";
import test from "node:test";
import { classifyRelease, incrementVersion } from "./prepare-community-release.mjs";

const report = (components) => ({ components });
const component = ({ id = "alpha", variants = [], controls = [], variantControls = {} } = {}) => ({
  id,
  variantIds: variants,
  controlKeys: controls,
  variantControlKeys: variantControls,
});

test("compatible source fixes produce a patch release", () => {
  const before = report([component({ controls: ["speed"] })]);
  assert.equal(classifyRelease(before, structuredClone(before)).inferredType, "patch");
});

test("new components, variants, or controls produce a minor release", () => {
  const before = report([component()]);
  const after = report([component({ variants: ["new"], controls: ["speed"] })]);
  const result = classifyRelease(before, after);
  assert.equal(result.inferredType, "minor");
  assert.deepEqual(result.removed, []);
  assert.equal(result.added.length, 2);
});

test("removed public surfaces produce a major release", () => {
  const before = report([component({ variants: ["old"], controls: ["speed"] })]);
  const after = report([component()]);
  const result = classifyRelease(before, after);
  assert.equal(result.inferredType, "major");
  assert.equal(result.removed.length, 2);
});

test("semantic versions increment at the requested level", () => {
  assert.equal(incrementVersion("0.3.0", "patch"), "0.3.1");
  assert.equal(incrementVersion("0.3.0", "minor"), "0.4.0");
  assert.equal(incrementVersion("0.3.0", "major"), "1.0.0");
});

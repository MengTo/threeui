import { useState } from "react";
import { CopyIcon } from "./icons";
import { SyntaxHighlightedCode } from "./SyntaxHighlightedCode";

export const INSTALL_COMMANDS = {
  npm: "npm install @designcodeio/threeui",
  pnpm: "pnpm add @designcodeio/threeui",
  bun: "bun add @designcodeio/threeui",
  yarn: "yarn add @designcodeio/threeui",
} as const;

type PackageManager = keyof typeof INSTALL_COMMANDS;

type InstallationStepsProps = {
  importName: string;
  includeStyles?: boolean;
  onNotify: (message: string) => void;
};

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function InstallationSteps({ importName, includeStyles = false, onNotify }: InstallationStepsProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>("npm");
  const rendererStep = includeStyles ? 3 : 2;

  return (
    <div className="steps">
      <div className="step">
        <div className="num card">1</div>
        <div className="h3row"><h3>Install the package</h3></div>
        <p>Add ThreeUI and its React peer dependencies to your project:</p>
        <div className="code-card card">
          <div className="tabbar">
            <div className="tabs" role="tablist" aria-label="Package manager">
              {(Object.keys(INSTALL_COMMANDS) as PackageManager[]).map((manager) => (
                <button
                  className="tab"
                  role="tab"
                  aria-selected={packageManager === manager}
                  key={manager}
                  onClick={() => setPackageManager(manager)}
                >
                  {manager}
                </button>
              ))}
            </div>
            <button
              className="icon-btn inset-shadow"
              aria-label="Copy install command"
              onClick={() => copyText(INSTALL_COMMANDS[packageManager]).then(() => onNotify("Copied"))}
            >
              <CopyIcon />
            </button>
          </div>
          <pre className="code"><SyntaxHighlightedCode code={INSTALL_COMMANDS[packageManager]} language="text" /></pre>
        </div>
      </div>

      {includeStyles ? (
        <div className="step">
          <div className="num card">2</div>
          <div className="h3row"><h3>Load the shared styles</h3></div>
          <p className="gap32">Import the package stylesheet once from your application entrypoint:</p>
          <div className="code-card padded card code-inline">
            <button
              className="icon-btn inset-shadow copy-corner"
              aria-label="Copy stylesheet import"
              onClick={() => copyText('import "@designcodeio/threeui/style.css";').then(() => onNotify("Copied"))}
            >
              <CopyIcon />
            </button>
            <pre className="code"><SyntaxHighlightedCode code={'import "@designcodeio/threeui/style.css";'} language="typescript" /></pre>
          </div>
        </div>
      ) : null}

      <div className="step">
        <div className="num card">{rendererStep}</div>
        <div className="h3row"><h3>Import the verified renderer</h3></div>
        <p className="gap32">Import only from the verified library entrypoint:</p>
        <div className="code-card padded card code-inline">
          <button
            className="icon-btn inset-shadow copy-corner"
            aria-label="Copy renderer import"
            onClick={() => copyText(`import { ${importName} } from "@designcodeio/threeui";`).then(() => onNotify("Copied"))}
          >
            <CopyIcon />
          </button>
          <pre className="code"><SyntaxHighlightedCode code={`import { ${importName} } from "@designcodeio/threeui";`} language="typescript" /></pre>
        </div>
      </div>
    </div>
  );
}

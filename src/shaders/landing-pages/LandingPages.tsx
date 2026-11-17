import { useEffect, useRef, useState, type CSSProperties } from "react";
import { applyPageCustomization, splitTypographyProps, usePageTypography, type LandingPageCustomization, type PageTypographyProps } from "./pageTypography";
import { BESTSELLERS_TYPOGRAPHY, COMPLETE_SHELF_TYPOGRAPHY, KAGE_TYPOGRAPHY, SYLVA_TYPOGRAPHY } from "./pageRecipes";

export type LandingPageFrameProps = { className?: string; sourceUrl: string; srcDoc?: string; style?: CSSProperties; title: string; customization?: LandingPageCustomization };
export type LandingPageProps = Omit<LandingPageFrameProps, "sourceUrl" | "title" | "customization">;
const FRAME_SANDBOX = "allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts";

export function LandingPageFrame({ className = "", customization, sourceUrl, srcDoc, style, title }: LandingPageFrameProps) {
  const [ready, setReady] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => { applyPageCustomization(frameRef.current, customization); }, [customization]);
  return <div className={`threeui-background landing-page-frame${className ? ` ${className}` : ""}`} data-state={ready ? "ready" : "loading"} style={{ position: "relative", overflow: "hidden", background: "#080808", pointerEvents: "auto", ...style }}>
    <iframe ref={frameRef} title={title} {...(srcDoc ? { srcDoc } : { src: sourceUrl })} sandbox={FRAME_SANDBOX} loading="eager" onLoad={(event) => { applyPageCustomization(event.currentTarget, customization); setReady(true); }} style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", border: 0, background: "#080808" }} />
  </div>;
}

function TypographyPage({ recipe, title, sourceUrl, ...props }: LandingPageProps & PageTypographyProps & { recipe: typeof KAGE_TYPOGRAPHY; title: string; sourceUrl: string }) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(recipe, type);
  return <LandingPageFrame {...frame} customization={customization} title={title} sourceUrl={sourceUrl} />;
}

export function KageLandingPage(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={KAGE_TYPOGRAPHY} title="Kage — Where stillness reveals the unseen" sourceUrl="/landing-pages/kage.html" />; }
export function CompleteShelfLandingPage(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={COMPLETE_SHELF_TYPOGRAPHY} title="Working Volumes — Seven Tools for Making" sourceUrl="/landing-pages/complete-shelf-v2.html" />; }
export function BestsellersBookShowcase(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={BESTSELLERS_TYPOGRAPHY} title="Field Manuals — Tools for Thought" sourceUrl="/landing-pages/bestsellers-book-showcase.html" />; }
export function MengToSketchbookLandingPage(props: LandingPageProps) { return <LandingPageFrame {...props} title="Meng To — Singapore Sketchbook" sourceUrl="/landing-pages/meng-to-sketchbook.html" />; }
export function SylvaHero(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={SYLVA_TYPOGRAPHY} title="Sylva — Into the living world" sourceUrl="/landing-pages/inner-green-3d.html" />; }
export function RedWingLandingPage(props: LandingPageProps) { return <LandingPageFrame {...props} title="Red Wing · Private Aviation" sourceUrl="/landing-pages/redwing/index.html" />; }
export function MoseyLandingPage(props: LandingPageProps) { return <LandingPageFrame {...props} title="Mosey AI Smart Home Companion" sourceUrl="/landing-pages/mosey/index.html" />; }
export function AzuraYachtLandingPage(props: LandingPageProps) { return <LandingPageFrame {...props} title="AZURA — Beyond the Horizon" sourceUrl="/landing-pages/azura-yacht.html" />; }
export function VantaLandingPage(props: LandingPageProps) { return <LandingPageFrame {...props} title="VANTA Electric Motorcycle Concept" sourceUrl="/landing-pages/vanta-designed.html" />; }
export function EmberfallLandingPage(props: LandingPageProps) { return <LandingPageFrame {...props} title="Emberfall — Begin the Hunt" sourceUrl="/landing-pages/emberfall/index.html" />; }

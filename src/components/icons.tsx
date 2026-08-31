import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const lineIcon = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function SearchIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <path d="M17 17l4 4" />
      <path d="M19 11a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function MaximizeIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function EllipsisIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="3" cy="8" r="1.15" />
      <circle cx="8" cy="8" r="1.15" />
      <circle cx="13" cy="8" r="1.15" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <path d="M20.2 15.3A8.8 8.8 0 0 1 8.7 3.8 9 9 0 1 0 20.2 15.3Z" />
    </svg>
  );
}

export function SystemIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function RestartIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <path d="M20.49 15A9 9 0 1 1 20.29 8.5" />
      <path d="M15 9h3c1.41 0 2.12 0 2.56-.44C21 8.12 21 7.41 21 6V3" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <rect x="4.5" y="10" width="15" height="10" rx="2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      <path d="M12 14v2" />
    </svg>
  );
}

export function TocIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <path d="M3.89 20.11C2.5 18.72 2.5 16.48 2.5 12s0-6.72 1.39-8.11C5.28 2.5 7.52 2.5 12 2.5s6.72 0 8.11 1.39C21.5 5.28 21.5 7.52 21.5 12s0 6.72-1.39 8.11C18.72 21.5 16.48 21.5 12 21.5s-6.72 0-8.11-1.39Z" />
      <path d="M9.5 2.5v19M13 7.5h5M13 12h5" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...lineIcon} {...props}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.91-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 7.01a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.89 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
    </svg>
  );
}

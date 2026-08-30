export interface ColorTheme {
  id: string;
  label: string;
  /** Used for the swatch preview button. */
  swatchHex: string;
  /** Full 50-950 scale, matching Tailwind's shade steps. */
  shades: Record<
    "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950",
    string
  >;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: "red",
    label: "Red",
    swatchHex: "#dc2626",
    shades: {
      "50": "#fef2f2", "100": "#fee2e2", "200": "#fecaca", "300": "#fca5a5",
      "400": "#f87171", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c",
      "800": "#991b1b", "900": "#7f1d1d", "950": "#450a0a",
    },
  },
  {
    id: "orange",
    label: "Orange",
    swatchHex: "#ea580c",
    shades: {
      "50": "#fff7ed", "100": "#ffedd5", "200": "#fed7aa", "300": "#fdba74",
      "400": "#fb923c", "500": "#f97316", "600": "#ea580c", "700": "#c2410c",
      "800": "#9a3412", "900": "#7c2d12", "950": "#431407",
    },
  },
  {
    id: "amber",
    label: "Amber",
    swatchHex: "#d97706",
    shades: {
      "50": "#fffbeb", "100": "#fef3c7", "200": "#fde68a", "300": "#fcd34d",
      "400": "#fbbf24", "500": "#f59e0b", "600": "#d97706", "700": "#b45309",
      "800": "#92400e", "900": "#78350f", "950": "#451a03",
    },
  },
  {
    id: "yellow",
    label: "Yellow",
    swatchHex: "#ca8a04",
    shades: {
      "50": "#fefce8", "100": "#fef9c3", "200": "#fef08a", "300": "#fde047",
      "400": "#facc15", "500": "#eab308", "600": "#ca8a04", "700": "#a16207",
      "800": "#854d0e", "900": "#713f12", "950": "#422006",
    },
  },
  {
    id: "green",
    label: "Green",
    swatchHex: "#16a34a",
    shades: {
      "50": "#f0fdf4", "100": "#dcfce7", "200": "#bbf7d0", "300": "#86efac",
      "400": "#4ade80", "500": "#22c55e", "600": "#16a34a", "700": "#15803d",
      "800": "#166534", "900": "#14532d", "950": "#052e16",
    },
  },
  {
    id: "emerald",
    label: "Emerald",
    swatchHex: "#059669",
    shades: {
      "50": "#ecfdf5", "100": "#d1fae5", "200": "#a7f3d0", "300": "#6ee7b7",
      "400": "#34d399", "500": "#10b981", "600": "#059669", "700": "#047857",
      "800": "#065f46", "900": "#064e3b", "950": "#022c22",
    },
  },
  {
    id: "teal",
    label: "Teal",
    swatchHex: "#0d9488",
    shades: {
      "50": "#f0fdfa", "100": "#ccfbf1", "200": "#99f6e4", "300": "#5eead4",
      "400": "#2dd4bf", "500": "#14b8a6", "600": "#0d9488", "700": "#0f766e",
      "800": "#115e59", "900": "#134e4a", "950": "#042f2e",
    },
  },
  {
    id: "cyan",
    label: "Cyan",
    swatchHex: "#0891b2",
    shades: {
      "50": "#ecfeff", "100": "#cffafe", "200": "#a5f3fc", "300": "#67e8f9",
      "400": "#22d3ee", "500": "#06b6d4", "600": "#0891b2", "700": "#0e7490",
      "800": "#155e75", "900": "#164e63", "950": "#083344",
    },
  },
  {
    id: "blue",
    label: "Blue",
    swatchHex: "#2563eb",
    shades: {
      "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd",
      "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8",
      "800": "#1e40af", "900": "#1e3a8a", "950": "#172554",
    },
  },
  {
    id: "indigo",
    label: "Indigo",
    swatchHex: "#4f46e5",
    shades: {
      "50": "#eef2ff", "100": "#e0e7ff", "200": "#c7d2fe", "300": "#a5b4fc",
      "400": "#818cf8", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca",
      "800": "#3730a3", "900": "#312e81", "950": "#1e1b4b",
    },
  },
  {
    id: "purple",
    label: "Purple",
    swatchHex: "#9333ea",
    shades: {
      "50": "#faf5ff", "100": "#f3e8ff", "200": "#e9d5ff", "300": "#d8b4fe",
      "400": "#c084fc", "500": "#a855f7", "600": "#9333ea", "700": "#7e22ce",
      "800": "#6b21a8", "900": "#581c87", "950": "#3b0764",
    },
  },
  {
    id: "pink",
    label: "Pink",
    swatchHex: "#db2777",
    shades: {
      "50": "#fdf2f8", "100": "#fce7f3", "200": "#fbcfe8", "300": "#f9a8d4",
      "400": "#f472b6", "500": "#ec4899", "600": "#db2777", "700": "#be185d",
      "800": "#9d174d", "900": "#831843", "950": "#500724",
    },
  },
];

export const DEFAULT_THEME_ID = "red";

export function themeToCssText(theme: ColorTheme): string {
  return Object.entries(theme.shades)
    .map(([shade, hex]) => `--color-brand-${shade}:${hex};`)
    .join("");
}

export function findColorTheme(id: string | null): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0];
}

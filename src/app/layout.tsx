import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import "./globals.css";

// Applies a saved color theme before hydration, avoiding a flash of the
// default (red) theme on load. Kept intentionally tiny and dependency-free
// since it must run as a blocking inline script.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var vars = localStorage.getItem("hs-color-theme-vars");
    if (vars) document.documentElement.style.cssText += vars;
  } catch (e) {}
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HanyuSprint — Learn Mandarin for Life in China",
  description:
    "5000+ Chinese words and everyday sentences with pinyin, pronunciation tips, and usage notes, organized by topic and HSK level.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
          HanyuSprint · Built for real conversations in China · 加油！
        </footer>
      </body>
    </html>
  );
}

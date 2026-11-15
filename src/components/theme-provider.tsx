"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

// attribute="data-theme" matches the design's :root[data-theme="dark"] tokens.
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}

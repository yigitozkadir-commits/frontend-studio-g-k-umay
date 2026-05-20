/**
 * next-themes — flicker'sız dark mode setup.
 */
'use client';
import { ThemeProvider } from 'next-themes';

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

// app/layout.tsx içinde:
// <html lang="en" suppressHydrationWarning>
//   <body><AppThemeProvider>{children}</AppThemeProvider></body>
// </html>

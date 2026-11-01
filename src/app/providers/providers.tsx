// app/providers.tsx
"use client";

import AuthProvider from "./session-provider";
export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider >{children}</AuthProvider>;
}
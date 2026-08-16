"use client";

import FloatingAIChatWidget from "./FloatingAIChatWidget";

export default function GlobalVoiceProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FloatingAIChatWidget />
    </>
  );
}

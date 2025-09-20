// app/admin/access-denied/layout.tsx
import { ReactNode } from "react";

export default function AccessDeniedLayout({ children }: { children: ReactNode }) {
  // Layout simple sin protección AdminGate para evitar redirección infinita
  return <>{children}</>;
}

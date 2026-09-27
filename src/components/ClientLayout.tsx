"use client";

import { usePathname } from "next/navigation";
import Navabar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { AuthProvider } from "@/src/lib/auth";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <Navabar />
      {children}
      <Footer />
    </AuthProvider>
  );
}

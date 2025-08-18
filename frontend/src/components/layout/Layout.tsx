"use client";

import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  className?: string;
}

export function Layout({
  children,
  showFooter = true,
  className = "",
}: LayoutProps) {
  return (
    <div className={`min-h-screen transition-none ${className}`}>
      <Navigation />
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}

// Convenience components for common layouts
export function PageLayout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Layout className={className}>{children}</Layout>;
}

export function DashboardLayout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Layout showFooter={false} className={className}>
      {children}
    </Layout>
  );
}

export function AuthLayout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Layout showFooter={false} className={className}>
      {children}
    </Layout>
  );
}

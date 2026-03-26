"use client";

import { ReactNode } from "react";

export function StudioWrapper({ children }: { children: ReactNode }) {
  // StudioWrapper chỉ wrap children, không render sidebar
  // Sidebar được quản lý bởi (admin)/layout.tsx cho các trang admin
  // và không có sidebar cho studio/auth routes
  return <>{children}</>;
}


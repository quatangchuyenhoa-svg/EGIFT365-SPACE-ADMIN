import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanity Studio",
  description: "Content Management",
};

export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout riêng cho Studio - không có html/body vì Next.js chỉ cho phép 1 root layout
  // Studio sẽ render trong root layout nhưng không dùng SidebarProvider
  return <>{children}</>;
}


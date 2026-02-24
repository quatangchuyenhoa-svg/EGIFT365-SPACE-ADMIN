import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { StudioWrapper } from "@/components/studio-wrapper";
import { UserProvider } from "@/components/UserProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Egift Admin",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <QueryProvider>
          <UserProvider>
            <StudioWrapper>{children}</StudioWrapper>
          </UserProvider>
        </QueryProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

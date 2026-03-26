import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { StudioWrapper } from "@/components/providers/studio-wrapper";
import { UserProvider } from "@/components/providers/user-provider";
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

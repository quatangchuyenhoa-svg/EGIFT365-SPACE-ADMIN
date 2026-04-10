import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { StudioWrapper } from "@/components/studio-wrapper";
import { UserProvider } from "@/components/UserProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { headers } from "next/headers";
import { fallbackLng } from "@/lib/i18n/settings";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-family",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-heading-family",
});

export const metadata: Metadata = {
  title: "Egift Admin",
  description: "Admin Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const lng = headerList.get('x-locale') || fallbackLng;

  return (
    <html lang={lng} suppressHydrationWarning className={`${inter.variable} ${firaCode.variable}`}>
      <body suppressHydrationWarning className="antialiased font-sans bg-background text-foreground relative">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <UserProvider>
              <StudioWrapper>{children}</StudioWrapper>
            </UserProvider>
          </QueryProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}

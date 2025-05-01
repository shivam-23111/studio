import type {Metadata} from 'next';
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from '@/contexts/session-context'; // Import SessionProvider

export const metadata: Metadata = {
  title: 'CollabEdit',
  description: 'Collaborative File and Code Sharing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Set dark theme as default
    <html lang="en" className="dark">
       {/* Apply font variables to the body */}
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <SessionProvider> {/* Wrap children with SessionProvider */}
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}

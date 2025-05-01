import type {Metadata} from 'next';
import { Geist_Sans, Geist_Mono } from 'next/font/google'; // Correct import
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// Correct usage of next/font/google
const geistSans = Geist_Sans({
  variable: '--font-geist-sans',
  subsets: ['latin'], // Add subsets if needed, adjust weights/styles as required
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'], // Add subsets if needed
});

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
    <html lang="en" className="dark"> {/* Set dark theme as default */}
      {/* Apply font variables to the body */}
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

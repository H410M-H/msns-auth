import "~/styles/globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Geist_Mono } from 'next/font/google'
import { type Metadata } from "next";

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// })

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
export const metadata: Metadata = {
  title: "MSNS-LMS",
  description: "Generated by MSNS-DEV",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

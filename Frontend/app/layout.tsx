import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { NavBar } from "@/components/nav-bar"
import { FinancialProvider } from "@/lib/financial-context"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "WealthTrack - Personal Wealth Management",
  description: "Track your income, assets, liabilities, and get AI-powered financial recommendations",
  generator: 'v0.app',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased min-h-screen overflow-x-hidden" suppressHydrationWarning>
        <FinancialProvider>
          <NavBar />
          <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
            {children}
          </main>
        </FinancialProvider>
      </body>
    </html>
  )
}

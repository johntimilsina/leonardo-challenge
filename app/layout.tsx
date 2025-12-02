import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppProviders } from '@/components/providers'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

/**
 * Application metadata for SEO and browser display.
 * Title and description reflect the Rick and Morty character explorer theme.
 */
export const metadata: Metadata = {
    title: 'Rick and Morty Explorer',
    description:
        'Explore characters from Rick and Morty universe - Leonardo.Ai Challenge',
}

/**
 * Root layout component that wraps all pages.
 * Applies global fonts and base styling.
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
            >
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    )
}

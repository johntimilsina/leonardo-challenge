'use client'

import Link from 'next/link'
import { UserInfo } from '@/components/user-info'

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <Link
                    href="/information/1"
                    className="flex items-center gap-2.5 font-semibold group"
                >
                    <span className="text-xl">🛸</span>
                    <span className="hidden sm:inline text-base">
                        Rick and Morty Explorer
                    </span>
                    <span className="sm:hidden text-base">R&M Explorer</span>
                </Link>
                <UserInfo />
            </div>
        </header>
    )
}

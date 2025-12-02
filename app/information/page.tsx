'use client'

import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useUser } from '@/lib/contexts'
import { Header, Footer } from '@/components/layout'
import { CharacterList } from '@/components/character'

function CharacterListFallback() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading characters...</p>
        </div>
    )
}

export default function InformationPage() {
    const router = useRouter()
    const { isLoading, isAuthenticated } = useUser()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/welcome')
        }
    }, [isLoading, isAuthenticated, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Character Explorer
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Discover characters from across the Rick and Morty
                        multiverse
                    </p>
                </div>

                <Suspense fallback={<CharacterListFallback />}>
                    <CharacterList />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}

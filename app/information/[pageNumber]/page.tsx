'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/contexts'
import { Header, Footer } from '@/components/layout'
import { CharacterList } from '@/components/character'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import { ScrollToTop } from '@/components/scroll-to-top'

interface PageProps {
    params: Promise<{ pageNumber: string }>
}

export default function InformationPage({ params }: PageProps) {
    const { pageNumber } = use(params)
    const router = useRouter()
    const { isLoading, isAuthenticated } = useUser()
    const page = Math.max(1, parseInt(pageNumber, 10) || 1)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/welcome')
        }
        if (isNaN(parseInt(pageNumber, 10)) || parseInt(pageNumber, 10) < 1) {
            router.replace('/information/1')
        }
    }, [isLoading, isAuthenticated, router, pageNumber])

    if (isLoading) {
        return <PageSkeleton />
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
                <CharacterList page={page} />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    )
}

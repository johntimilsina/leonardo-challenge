'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/contexts'
import { WelcomeForm } from '@/components/welcome-form'

/**
 * Welcome page - entry point for unauthenticated users.
 * Redirects authenticated users to the information page.
 */
export default function WelcomePage() {
    const router = useRouter()
    const { isLoading, isAuthenticated } = useUser()

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/information/1')
        }
    }, [isLoading, isAuthenticated, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (isAuthenticated) {
        return null
    }

    return <WelcomeForm />
}

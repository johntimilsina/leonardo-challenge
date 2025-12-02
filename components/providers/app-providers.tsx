'use client'

import { ApolloProvider } from './apollo-provider'
import { UserProvider } from '@/lib/contexts'
import { OnboardingModal } from '@/components/onboarding-modal'

interface AppProvidersProps {
    children: React.ReactNode
}

/**
 * Combined app providers wrapper.
 * Groups all context providers and the blocking onboarding modal.
 * Must be a client component to handle client-side state.
 */
export function AppProviders({ children }: AppProvidersProps) {
    return (
        <UserProvider>
            <ApolloProvider>
                <OnboardingModal />
                {children}
            </ApolloProvider>
        </UserProvider>
    )
}

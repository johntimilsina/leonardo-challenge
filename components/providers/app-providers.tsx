'use client'

import { ApolloProvider } from './apollo-provider'
import { UserProvider } from '@/lib/contexts'

interface AppProvidersProps {
    children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <UserProvider>
            <ApolloProvider>{children}</ApolloProvider>
        </UserProvider>
    )
}

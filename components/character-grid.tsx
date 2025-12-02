'use client'

import { useQuery } from '@apollo/client/react'
import { useUser } from '@/lib/contexts'
import { GET_CHARACTERS } from '@/lib/graphql'
import type { GetCharactersQuery, Character } from '@/lib/graphql'
import { CharacterCard } from './character-card'
import { Pagination } from './pagination'
import { Skeleton } from '@/components/ui/skeleton'

interface CharacterGridProps {
    page: number
    onSelectCharacter: (character: Character) => void
}

export function CharacterGrid({ page, onSelectCharacter }: CharacterGridProps) {
    const { isAuthenticated, isLoading: isUserLoading } = useUser()

    const { data, loading, error } = useQuery<GetCharactersQuery>(
        GET_CHARACTERS,
        {
            variables: { page },
            skip: !isAuthenticated || isUserLoading,
        }
    )

    if (isUserLoading) {
        return <CharacterGridSkeleton />
    }

    if (!isAuthenticated) {
        return null
    }

    if (loading) {
        return <CharacterGridSkeleton />
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium text-destructive">
                    Failed to load characters
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    {error.message}
                </p>
            </div>
        )
    }

    if (!data?.characters?.results) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium">No characters found</p>
                <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your search or go to page 1.
                </p>
            </div>
        )
    }

    const characters = data.characters.results.filter(
        (c): c is Character => c !== null
    )
    const info = data.characters.info

    return (
        <div className="space-y-8">
            <p className="text-sm text-muted-foreground">
                Showing {characters.length} of {info?.count ?? 0} characters
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {characters.map((character) => (
                    <CharacterCard
                        key={character.id}
                        character={character}
                        onClick={() => onSelectCharacter(character)}
                    />
                ))}
            </div>

            {info && (
                <Pagination
                    info={info}
                    currentPage={page}
                    basePath="/information"
                />
            )}
        </div>
    )
}

function CharacterGridSkeleton() {
    return (
        <div className="space-y-8">
            <Skeleton className="h-5 w-48" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-lg border">
                        <Skeleton className="aspect-square w-full" />
                        <div className="p-4 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

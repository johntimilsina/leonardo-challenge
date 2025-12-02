'use client'

import { useState, useCallback } from 'react'
import { useQuery } from '@apollo/client/react'
import { useUser } from '@/lib/contexts'
import { GET_CHARACTERS } from '@/lib/graphql'
import type { GetCharactersQuery, Character } from '@/lib/graphql'
import { CharacterCard } from './card'
import { CharacterModal } from './modal'
import { Pagination } from '@/components/pagination'
import { Skeleton } from '@/components/ui/skeleton'

interface CharacterListProps {
    page: number
}

function CharacterCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border/50 overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </div>
    )
}

function CharacterListSkeleton() {
    return (
        <>
            <Skeleton className="h-5 w-40 mb-6" />
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <CharacterCardSkeleton key={i} />
                ))}
            </div>
            <div className="mt-6 sm:mt-8 flex justify-center">
                <Skeleton className="h-10 w-48 sm:w-64" />
            </div>
        </>
    )
}

export function CharacterList({ page }: CharacterListProps) {
    const { isAuthenticated, isLoading: isUserLoading } = useUser()
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null)

    const { data, loading, error } = useQuery<GetCharactersQuery>(
        GET_CHARACTERS,
        {
            variables: { page },
            skip: !isAuthenticated || isUserLoading,
        }
    )

    const handleSelectCharacter = useCallback((character: Character) => {
        setSelectedCharacter(character)
    }, [])

    const handleCloseModal = useCallback(() => {
        setSelectedCharacter(null)
    }, [])

    if (isUserLoading || loading) {
        return <CharacterListSkeleton />
    }

    if (!isAuthenticated) {
        return null
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
        <>
            <p className="mb-6 text-sm text-muted-foreground">
                Showing {characters.length} of {info?.count ?? 0} characters
            </p>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {characters.map((character) => (
                    <CharacterCard
                        key={character.id}
                        character={character}
                        onClick={() => handleSelectCharacter(character)}
                    />
                ))}
            </div>

            {info && (
                <div className="mt-6 sm:mt-8">
                    <Pagination
                        info={info}
                        currentPage={page}
                        basePath="/information"
                    />
                </div>
            )}

            <CharacterModal
                character={selectedCharacter}
                onClose={handleCloseModal}
            />
        </>
    )
}

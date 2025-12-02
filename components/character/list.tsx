'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@apollo/client/react'
import { Loader2 } from 'lucide-react'
import { useUser } from '@/lib/contexts'
import { GET_CHARACTERS } from '@/lib/graphql'
import type { GetCharactersQuery, Character } from '@/lib/graphql'
import { CharacterCard } from './card'
import { CharacterModal } from './modal'
import { Pagination } from '@/components/pagination'

export function CharacterList() {
    const searchParams = useSearchParams()
    const { isAuthenticated, isLoading: isUserLoading } = useUser()
    const [selectedCharacter, setSelectedCharacter] =
        useState<Character | null>(null)

    const pageParam = searchParams.get('page')
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1

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

    if (isUserLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                    Loading characters...
                </p>
            </div>
        )
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

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {characters.map((character) => (
                    <CharacterCard
                        key={character.id}
                        character={character}
                        onClick={() => handleSelectCharacter(character)}
                    />
                ))}
            </div>

            {info && (
                <div className="mt-8">
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

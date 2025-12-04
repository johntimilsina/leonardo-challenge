'use client'

import { useState, useCallback, useEffect, useTransition, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/lib/contexts'
import { fetchCharacters } from '@/app/actions/characters'
import { CharacterCard, type BaseCharacter } from './card'
import { CharacterModal } from './modal'
import { FilterBar, type CharacterFilters } from './filter-bar'
import { Pagination } from '@/components/pagination'
import { Skeleton } from '@/components/ui/skeleton'

interface CharactersResponse {
    info: {
        count: number
        pages: number
        next: number | null
        prev: number | null
    }
    results: BaseCharacter[]
}

interface CharacterListProps {
    /** Current page number for pagination */
    page: number
}

/** Parse filters from URL search params */
function parseFiltersFromParams(searchParams: URLSearchParams): CharacterFilters {
    const filters: CharacterFilters = {}
    const name = searchParams.get('name')
    const status = searchParams.get('status')
    const species = searchParams.get('species')
    const gender = searchParams.get('gender')
    if (name) filters.name = name
    if (status) filters.status = status
    if (species) filters.species = species
    if (gender) filters.gender = gender
    return filters
}

/** Build URL search params string from filters */
function buildFilterParams(filters: CharacterFilters): string {
    const params = new URLSearchParams()
    if (filters.name) params.set('name', filters.name)
    if (filters.status) params.set('status', filters.status)
    if (filters.species) params.set('species', filters.species)
    if (filters.gender) params.set('gender', filters.gender)
    const str = params.toString()
    return str ? `?${str}` : ''
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

/**
 * Displays a paginated grid of character cards with modal detail view.
 * Uses Next.js Server Actions for data fetching.
 */
export function CharacterList({ page }: CharacterListProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { isAuthenticated, isLoading: isUserLoading } = useUser()
    const [selectedCharacterIndex, setSelectedCharacterIndex] = useState<number | null>(null)
    const [data, setData] = useState<CharactersResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams])

    useEffect(() => {
        if (!isAuthenticated || isUserLoading) return

        startTransition(async () => {
            const result = await fetchCharacters(page, filters)
            if (result.error) {
                setError(result.error)
                setData(null)
            } else {
                setData(result.data as CharactersResponse | null)
                setError(null)
            }
        })
    }, [page, filters, isAuthenticated, isUserLoading])

    const characters = useMemo(() => 
        data?.results?.filter((c): c is BaseCharacter => c !== null) || []
    , [data])

    const handleFilterChange = useCallback((newFilters: CharacterFilters) => {
        const params = buildFilterParams(newFilters)
        router.push(`/information/1${params}`)
    }, [router])

    const selectedCharacter = selectedCharacterIndex !== null ? characters[selectedCharacterIndex] : null

    const handleSelectCharacter = useCallback((character: BaseCharacter) => {
        const index = characters.findIndex(c => c.id === character.id)
        setSelectedCharacterIndex(index)
    }, [characters])

    const handleCloseModal = useCallback(() => {
        setSelectedCharacterIndex(null)
    }, [])

    const handlePreviousCharacter = useCallback(() => {
        if (selectedCharacterIndex !== null && selectedCharacterIndex > 0) {
            setSelectedCharacterIndex(selectedCharacterIndex - 1)
        }
    }, [selectedCharacterIndex])

    const handleNextCharacter = useCallback(() => {
        if (selectedCharacterIndex !== null && selectedCharacterIndex < characters.length - 1) {
            setSelectedCharacterIndex(selectedCharacterIndex + 1)
        }
    }, [selectedCharacterIndex, characters.length])

    if (isUserLoading) {
        return <CharacterListSkeleton />
    }

    if (!isAuthenticated) {
        return null
    }

    const isLoading = isPending
    const info = data?.info
    const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof CharacterFilters])
    const hasResults = data?.results && data.results.length > 0

    return (
        <>
            <FilterBar filters={filters} onFilterChange={handleFilterChange} disabled={isLoading} />

            {error ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-lg font-medium text-destructive">
                        Failed to load characters
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {error}
                    </p>
                </div>
            ) : isLoading ? (
                <>
                    <p className="mb-4 text-sm text-muted-foreground">Loading characters...</p>
                    <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <CharacterCardSkeleton key={i} />
                        ))}
                    </div>
                </>
            ) : !hasResults ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-lg font-medium">No characters found</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {hasActiveFilters ? 'Try adjusting your filters.' : 'Try a different page.'}
                    </p>
                </div>
            ) : (
                <>
                    <p className="mb-4 text-sm text-muted-foreground">
                        {hasActiveFilters ? 'Found' : 'Showing'} {info?.count ?? 0} characters
                        {hasActiveFilters && ' matching filters'}
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                                queryString={buildFilterParams(filters)}
                            />
                        </div>
                    )}
                </>
            )}

            <CharacterModal
                character={selectedCharacter}
                onClose={handleCloseModal}
                onPrevious={handlePreviousCharacter}
                onNext={handleNextCharacter}
                hasPrevious={selectedCharacterIndex !== null && selectedCharacterIndex > 0}
                hasNext={selectedCharacterIndex !== null && selectedCharacterIndex < characters.length - 1}
            />
        </>
    )
}

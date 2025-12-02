'use server'

import type { CharacterFilters } from '@/components/character/filter-bar'

interface Character {
    id: string
    name: string
    status: string
    species: string
    type: string
    gender: string
    origin: { name: string }
    location: { name: string }
    image: string
}

interface CharactersResponse {
    info: {
        count: number
        pages: number
        next: number | null
        prev: number | null
    }
    results: Character[]
}

interface FetchCharactersResult {
    data: CharactersResponse | null
    error: string | null
}

/**
 * Server Action to fetch characters from the Rick and Morty GraphQL API.
 * Demonstrates Next.js Server Actions for data fetching.
 */
export async function fetchCharacters(
    page: number,
    filters?: CharacterFilters
): Promise<FetchCharactersResult> {
    try {
        const query = `
            query GetCharacters($page: Int!, $filter: FilterCharacter) {
                characters(page: $page, filter: $filter) {
                    info {
                        count
                        pages
                        next
                        prev
                    }
                    results {
                        id
                        name
                        status
                        species
                        type
                        gender
                        origin {
                            name
                        }
                        location {
                            name
                        }
                        image
                    }
                }
            }
        `

        const response = await fetch('https://rickandmortyapi.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    page,
                    filter: filters && Object.keys(filters).length > 0 ? filters : undefined,
                },
            }),
            // Next.js fetch caching - revalidate every 60 seconds
            next: { revalidate: 60 },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const json = await response.json()

        if (json.errors) {
            throw new Error(json.errors[0]?.message || 'GraphQL error')
        }

        return {
            data: json.data.characters,
            error: null,
        }
    } catch (error) {
        console.error('Failed to fetch characters:', error)
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch characters',
        }
    }
}

'use client'

import Image from 'next/image'
import type { Character } from '@/lib/graphql'
import { Card, CardContent } from '@/components/ui/card'

interface CharacterCardProps {
    character: Character
    onClick: () => void
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
    const statusColor =
        character.status === 'Alive'
            ? 'bg-green-500'
            : character.status === 'Dead'
              ? 'bg-red-500'
              : 'bg-gray-500'

    return (
        <Card
            className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onClick()
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${character.name}`}
        >
            <div className="relative aspect-square">
                {character.image && (
                    <Image
                        src={character.image}
                        alt={character.name ?? 'Character'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                )}
            </div>
            <CardContent className="p-4">
                <h3 className="truncate text-lg font-semibold">
                    {character.name}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span
                        className={`h-2 w-2 rounded-full ${statusColor}`}
                        aria-hidden="true"
                    />
                    <span>
                        {character.status} - {character.species}
                    </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                    {character.location?.name ?? 'Unknown location'}
                </p>
            </CardContent>
        </Card>
    )
}

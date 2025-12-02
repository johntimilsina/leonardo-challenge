'use client'

import Image from 'next/image'
import { MapPin } from 'lucide-react'

/** Base character type for card display (without episodes) */
export interface BaseCharacter {
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

interface CharacterCardProps {
    /** Character data to display */
    character: BaseCharacter
    /** Callback when card is clicked */
    onClick: () => void
}

/**
 * Displays a character in a card format with image, status badge, and location.
 * Includes keyboard navigation support for accessibility.
 */
export function CharacterCard({ character, onClick }: CharacterCardProps) {
    const statusConfig = {
        Alive: { bg: 'bg-emerald-500', text: 'text-emerald-500' },
        Dead: { bg: 'bg-red-500', text: 'text-red-500' },
        unknown: { bg: 'bg-gray-400', text: 'text-gray-400' },
    }

    const status = statusConfig[character.status as keyof typeof statusConfig] || statusConfig.unknown

    return (
        <article
            className="group cursor-pointer rounded-lg bg-card border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            <div className="relative aspect-[4/3] overflow-hidden">
                {character.image && (
                    <Image
                        src={character.image}
                        alt={character.name ?? 'Character'}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        quality={100}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-md shadow-lg border border-white/20 text-white`}>
                        <span className={`h-2 w-2 rounded-full ${status.bg} animate-pulse`} />
                        {character.status}
                    </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-black/30 backdrop-blur-md text-white border border-white/10">
                        {character.species}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-foreground truncate text-base">
                    {character.name}
                </h3>
                
                <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-sm truncate">
                        {character.location?.name ?? 'Unknown'}
                    </span>
                </div>

                {character.origin?.name && character.origin.name !== 'unknown' && (
                    <p className="mt-1.5 text-xs text-muted-foreground/70 truncate">
                        Origin: {character.origin.name}
                    </p>
                )}
            </div>
        </article>
    )
}

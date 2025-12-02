'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Globe, User2, Tv, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useQuery } from '@apollo/client/react'
import { GET_CHARACTER } from '@/lib/graphql'
import type { GetCharacterQuery } from '@/lib/graphql'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { BaseCharacter } from './card'

interface CharacterModalProps {
    /** Character to display (base info), null to close modal */
    character: BaseCharacter | null
    /** Callback when modal is closed */
    onClose: () => void
    /** Callback to navigate to previous character */
    onPrevious?: () => void
    /** Callback to navigate to next character */
    onNext?: () => void
    /** Whether there is a previous character */
    hasPrevious?: boolean
    /** Whether there is a next character */
    hasNext?: boolean
}

/**
 * Modal dialog displaying detailed character information including episodes.
 * Fetches additional character data (episodes) when opened.
 */
export function CharacterModal({ 
    character, 
    onClose, 
    onPrevious, 
    onNext,
    hasPrevious = false,
    hasNext = false 
}: CharacterModalProps) {
    const [loadedImageId, setLoadedImageId] = useState<string | null>(null)
    const { data, loading } = useQuery<GetCharacterQuery>(GET_CHARACTER, {
        variables: { id: character?.id },
        skip: !character?.id,
    })

    const fullCharacter = data?.character
    const isOpen = !!character
    const imageLoading = character?.id !== loadedImageId

    const statusConfig = {
        Alive: { bg: 'bg-emerald-500' },
        Dead: { bg: 'bg-red-500' },
        unknown: { bg: 'bg-gray-400' },
    }

    const displayCharacter = fullCharacter || character
    const status = displayCharacter
        ? statusConfig[displayCharacter.status as keyof typeof statusConfig] ||
          statusConfig.unknown
        : statusConfig.unknown

    const episodes = fullCharacter?.episode?.filter(Boolean) || []

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in-0"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            >
                {/* Navigation Arrows - Desktop */}
                {onPrevious && hasPrevious && (
                    <Button
                        onClick={onPrevious}
                        variant="ghost"
                        size="icon"
                        className="hidden sm:flex absolute left-4 z-10 h-12 w-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 pointer-events-auto"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                )}
                
                {onNext && hasNext && (
                    <Button
                        onClick={onNext}
                        variant="ghost"
                        size="icon"
                        className="hidden sm:flex absolute right-4 z-10 h-12 w-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 pointer-events-auto"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                )}

                {/* Main Modal */}
                <div 
                    className="relative w-full max-w-4xl h-[90vh] sm:h-[600px] bg-background rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 z-20 h-10 w-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70"
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    <div className="flex flex-col sm:flex-row h-full">
                        {/* Image Section */}
                        <div className="relative w-full sm:w-[45%] h-64 sm:h-full bg-black flex-shrink-0">
                            {imageLoading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                                    <Skeleton className="w-full h-full rounded-none" />
                                </div>
                            )}
                            {displayCharacter?.image ? (
                                <Image
                                    src={displayCharacter.image}
                                    alt={displayCharacter.name ?? 'Character'}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, 450px"
                                    quality={100}
                                    priority
                                    onLoad={() => setLoadedImageId(character?.id ?? null)}
                                    onError={() => setLoadedImageId(character?.id ?? null)}
                                />
                            ) : (
                                !imageLoading && <Skeleton className="w-full h-full rounded-none" />
                            )}
                            
                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md border border-white/20 text-white">
                                    <span className={`h-2.5 w-2.5 rounded-full ${status.bg} animate-pulse`} />
                                    {displayCharacter?.status ?? 'Unknown'}
                                </span>
                            </div>

                            {/* Mobile Navigation */}
                            <div className="sm:hidden absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
                                {onPrevious && hasPrevious && (
                                    <Button
                                        onClick={onPrevious}
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white pointer-events-auto"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                )}
                                {onNext && hasNext && (
                                    <Button
                                        onClick={onNext}
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white ml-auto pointer-events-auto"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
                            <div className="space-y-6">
                                {/* Header */}
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold">
                                        {displayCharacter?.name ?? 'Loading...'}
                                    </h2>
                                    <p className="text-muted-foreground mt-1">
                                        {displayCharacter?.species}
                                        {displayCharacter?.type && ` • ${displayCharacter.type}`}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem
                                        icon={<User2 className="h-4 w-4" />}
                                        label="Gender"
                                        value={displayCharacter?.gender}
                                    />
                                    <DetailItem
                                        icon={<Globe className="h-4 w-4" />}
                                        label="Origin"
                                        value={displayCharacter?.origin?.name}
                                    />
                                    <DetailItem
                                        icon={<MapPin className="h-4 w-4" />}
                                        label="Location"
                                        value={displayCharacter?.location?.name}
                                        className="col-span-2"
                                    />
                                </div>

                                {/* Episodes */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Tv className="h-4 w-4 text-muted-foreground" />
                                        <h3 className="font-semibold">
                                            Episodes
                                            <span className="font-normal text-muted-foreground ml-2">
                                                ({loading ? '—' : episodes.length})
                                            </span>
                                        </h3>
                                    </div>
                                    
                                    <div className="grid gap-2 max-h-48 overflow-y-auto">
                                        {loading ? (
                                            Array.from({ length: 4 }).map((_, i) => (
                                                <Skeleton key={i} className="h-10" />
                                            ))
                                        ) : (
                                            episodes.slice(0, 10).map((ep) => ep && (
                                                <div
                                                    key={ep.id}
                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border/50"
                                                >
                                                    <span className="font-semibold text-primary text-sm">
                                                        {ep.episode}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground truncate">
                                                        {ep.name}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                        {!loading && episodes.length > 10 && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                +{episodes.length - 10} more episodes
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

interface DetailItemProps {
    icon: React.ReactNode
    label: string
    value: string | null | undefined
    className?: string
}

function DetailItem({ icon, label, value, className }: DetailItemProps) {
    return (
        <div className={`flex items-start gap-2 ${className ?? ''}`}>
            <div className="text-muted-foreground mt-0.5">{icon}</div>
            <div className="min-w-0 flex-1">
                <dt className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                </dt>
                <dd className="text-sm font-medium truncate">
                    {value ?? 'Unknown'}
                </dd>
            </div>
        </div>
    )
}

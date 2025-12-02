'use client'

import Image from 'next/image'
import { MapPin, Globe, User2, Tv } from 'lucide-react'
import { useQuery } from '@apollo/client/react'
import { GET_CHARACTER } from '@/lib/graphql'
import type { Character, GetCharacterQuery } from '@/lib/graphql'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

interface CharacterModalProps {
    character: Character | null
    onClose: () => void
}

export function CharacterModal({ character, onClose }: CharacterModalProps) {
    const { data, loading } = useQuery<GetCharacterQuery>(GET_CHARACTER, {
        variables: { id: character?.id },
        skip: !character?.id,
    })

    const fullCharacter = data?.character
    const isOpen = !!character

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
    const displayEpisodes = episodes.slice(0, 6)
    const remainingCount = episodes.length - displayEpisodes.length

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                <DialogTitle className="sr-only">
                    {displayCharacter?.name ?? 'Character Details'}
                </DialogTitle>
                <div className="flex flex-col sm:flex-row">
                    {/* Left: Image */}
                    <div className="relative w-full sm:w-72 flex-shrink-0 aspect-square sm:aspect-auto sm:min-h-[400px]">
                        {displayCharacter?.image ? (
                            <Image
                                src={displayCharacter.image}
                                alt={displayCharacter.name ?? 'Character'}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <Skeleton className="w-full h-full" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
                        <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/95 backdrop-blur-sm shadow-sm">
                                <span className={`h-2 w-2 rounded-full ${status.bg}`} />
                                {displayCharacter?.status ?? 'Unknown'}
                            </span>
                        </div>
                        {/* Mobile name overlay */}
                        <div className="absolute bottom-3 left-3 right-3 sm:hidden">
                            <h2 className="text-xl font-bold text-white">
                                {displayCharacter?.name ?? 'Loading...'}
                            </h2>
                            <p className="text-sm text-white/80 mt-0.5">
                                {displayCharacter?.species}
                            </p>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex-1 p-5 overflow-y-auto max-h-[50vh] sm:overflow-visible sm:max-h-none">
                        {/* Header - desktop only */}
                        <div className="mb-4 hidden sm:block">
                            <h2 className="text-xl font-bold">
                                {displayCharacter?.name ?? 'Loading...'}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {displayCharacter?.species}
                                {displayCharacter?.type && ` • ${displayCharacter.type}`}
                            </p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <DetailItem
                                icon={<User2 className="h-3.5 w-3.5" />}
                                label="Gender"
                                value={displayCharacter?.gender}
                            />
                            <DetailItem
                                icon={<Globe className="h-3.5 w-3.5" />}
                                label="Origin"
                                value={displayCharacter?.origin?.name}
                            />
                            <DetailItem
                                icon={<MapPin className="h-3.5 w-3.5" />}
                                label="Location"
                                value={displayCharacter?.location?.name}
                                className="col-span-2"
                            />
                        </div>

                        {/* Episodes */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Tv className="h-3.5 w-3.5 text-muted-foreground" />
                                <h3 className="text-sm font-semibold">
                                    Episodes{' '}
                                    <span className="font-normal text-muted-foreground">
                                        ({loading ? '...' : episodes.length})
                                    </span>
                                </h3>
                            </div>

                            <div className="space-y-1.5">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <Skeleton key={i} className="h-7" />
                                    ))
                                ) : (
                                    <>
                                        {displayEpisodes.map((ep) => (
                                            <div
                                                key={ep?.id}
                                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/50 text-sm"
                                            >
                                                <span className="font-medium text-primary text-xs">
                                                    {ep?.episode}
                                                </span>
                                                <span className="text-muted-foreground truncate text-xs">
                                                    {ep?.name}
                                                </span>
                                            </div>
                                        ))}
                                        {remainingCount > 0 && (
                                            <p className="text-xs text-muted-foreground pt-1">
                                                +{remainingCount} more episodes
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
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

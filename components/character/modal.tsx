'use client'

import Image from 'next/image'
import { MapPin, Globe, User2, Dna } from 'lucide-react'
import type { Character } from '@/lib/graphql'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface CharacterModalProps {
    character: Character | null
    onClose: () => void
}

export function CharacterModal({ character, onClose }: CharacterModalProps) {
    if (!character) return null

    const statusConfig = {
        Alive: { bg: 'bg-emerald-500', text: 'text-emerald-600' },
        Dead: { bg: 'bg-red-500', text: 'text-red-600' },
        unknown: { bg: 'bg-gray-400', text: 'text-gray-600' },
    }

    const status =
        statusConfig[character.status as keyof typeof statusConfig] ||
        statusConfig.unknown

    return (
        <Dialog open={!!character} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                <div className="relative">
                    {character.image && (
                        <div className="relative aspect-square w-full">
                            <Image
                                src={character.image}
                                alt={character.name ?? 'Character'}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>
                    )}

                    <div className="absolute top-4 left-4">
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white/95 backdrop-blur-sm shadow-sm`}
                        >
                            <span className={`h-2.5 w-2.5 rounded-full ${status.bg}`} />
                            {character.status}
                        </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <DialogHeader className="text-left">
                            <DialogTitle className="text-2xl font-bold text-white">
                                {character.name}
                            </DialogTitle>
                            <p className="text-white/80 text-sm mt-1">
                                {character.species}
                                {character.type && ` • ${character.type}`}
                            </p>
                        </DialogHeader>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem
                            icon={<User2 className="h-4 w-4" />}
                            label="Gender"
                            value={character.gender}
                        />
                        <DetailItem
                            icon={<Dna className="h-4 w-4" />}
                            label="Species"
                            value={character.species}
                        />
                    </div>

                    <div className="pt-2 space-y-3">
                        <DetailItem
                            icon={<Globe className="h-4 w-4" />}
                            label="Origin"
                            value={character.origin?.name}
                            fullWidth
                        />
                        <DetailItem
                            icon={<MapPin className="h-4 w-4" />}
                            label="Last Known Location"
                            value={character.location?.name}
                            fullWidth
                        />
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
    fullWidth?: boolean
}

function DetailItem({ icon, label, value, fullWidth }: DetailItemProps) {
    return (
        <div
            className={`flex items-start gap-3 ${fullWidth ? 'p-3 rounded-lg bg-muted/50' : ''}`}
        >
            <div className="text-muted-foreground mt-0.5">{icon}</div>
            <div className="min-w-0 flex-1">
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium truncate">
                    {value ?? 'Unknown'}
                </dd>
            </div>
        </div>
    )
}

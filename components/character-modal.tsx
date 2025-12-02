'use client'

import Image from 'next/image'
import type { Character } from '@/lib/graphql'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface CharacterModalProps {
    character: Character | null
    onClose: () => void
}

export function CharacterModal({ character, onClose }: CharacterModalProps) {
    if (!character) return null

    const statusColor =
        character.status === 'Alive'
            ? 'bg-green-500'
            : character.status === 'Dead'
              ? 'bg-red-500'
              : 'bg-gray-500'

    return (
        <Dialog open={!!character} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {character.name}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2">
                        <span
                            className={`h-2 w-2 rounded-full ${statusColor}`}
                            aria-hidden="true"
                        />
                        <span>
                            {character.status} - {character.species}
                            {character.type && ` (${character.type})`}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
                    {character.image && (
                        <div className="relative aspect-square overflow-hidden rounded-lg mx-auto sm:mx-0">
                            <Image
                                src={character.image}
                                alt={character.name ?? 'Character'}
                                width={200}
                                height={200}
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <DetailItem label="Gender" value={character.gender} />
                        <DetailItem
                            label="Origin"
                            value={character.origin?.name}
                        />
                        <DetailItem
                            label="Last Known Location"
                            value={character.location?.name}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface DetailItemProps {
    label: string
    value: string | null | undefined
}

function DetailItem({ label, value }: DetailItemProps) {
    return (
        <div>
            <dt className="text-sm font-medium text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-1 text-sm">{value ?? 'Unknown'}</dd>
        </div>
    )
}

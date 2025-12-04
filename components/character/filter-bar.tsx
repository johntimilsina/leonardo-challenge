'use client'

import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export interface CharacterFilters {
    name?: string
    status?: string
    species?: string
    gender?: string
}

interface FilterBarProps {
    filters: CharacterFilters
    onFilterChange: (filters: CharacterFilters) => void
    disabled?: boolean
}

const STATUS_OPTIONS = [
    { value: 'Alive', label: 'Alive' },
    { value: 'Dead', label: 'Dead' },
    { value: 'unknown', label: 'Unknown' },
]

const GENDER_OPTIONS = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Genderless', label: 'Genderless' },
    { value: 'unknown', label: 'Unknown' },
]

const SPECIES_OPTIONS = [
    { value: 'Human', label: 'Human' },
    { value: 'Alien', label: 'Alien' },
    { value: 'Humanoid', label: 'Humanoid' },
    { value: 'Robot', label: 'Robot' },
    { value: 'Animal', label: 'Animal' },
    { value: 'Mythological Creature', label: 'Mythological' },
]

/**
 * Filter bar component for character search and filtering.
 */
export function FilterBar({ filters, onFilterChange, disabled = false }: FilterBarProps) {
    const [searchInput, setSearchInput] = useState(filters.name || '')
    const [lastFilterName, setLastFilterName] = useState(filters.name)

    if (lastFilterName !== filters.name) {
        setLastFilterName(filters.name)
        setSearchInput(filters.name || '')
    }

    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        if (!disabled) {
            onFilterChange({ ...filters, name: searchInput || undefined })
        }
    }, [filters, searchInput, onFilterChange, disabled])

    const handleClearSearch = useCallback(() => {
        setSearchInput('')
        onFilterChange({ ...filters, name: undefined })
    }, [filters, onFilterChange])

    const handleFilterSelect = useCallback((key: keyof CharacterFilters, value: string) => {
        if (!disabled) {
            onFilterChange({ ...filters, [key]: value === 'all' ? undefined : value })
        }
    }, [filters, onFilterChange, disabled])

    const handleClearFilters = useCallback(() => {
        setSearchInput('')
        onFilterChange({})
    }, [onFilterChange])

    const hasActiveFilters = filters.name || filters.status || filters.species || filters.gender

    return (
        <div className="sticky top-14 z-30 -mx-4 -mt-6 sm:-mt-8 px-4 py-3 bg-background/95 backdrop-blur-sm border-b border-border/50 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Search by name..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            disabled={disabled}
                            className="pl-8 pr-8 h-9 text-sm"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                disabled={disabled}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                    <Button type="submit" size="sm" disabled={disabled} className="h-9 px-4 text-sm">
                        Search
                    </Button>
                </form>

                {/* Divider - desktop only */}
                <div className="hidden sm:block w-px h-6 bg-border/50" />

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(v) => handleFilterSelect('status', v)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-9 w-[120px] text-xs">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            {STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.species || 'all'}
                        onValueChange={(v) => handleFilterSelect('species', v)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-9 w-[120px] text-xs">
                            <SelectValue placeholder="Species" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Species</SelectItem>
                            {SPECIES_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.gender || 'all'}
                        onValueChange={(v) => handleFilterSelect('gender', v)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-9 w-[120px] text-xs">
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Genders</SelectItem>
                            {GENDER_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            disabled={disabled}
                            className="h-9 px-2 text-xs text-muted-foreground hover:text-destructive"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

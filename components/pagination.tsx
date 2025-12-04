'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Info } from '@/lib/graphql'

interface PaginationProps {
    /** Pagination info from GraphQL API */
    info: Info
    /** Current active page number */
    currentPage: number
    /** Base path for pagination URLs (e.g., '/information') */
    basePath: string
    /** Optional query string to append to URLs (e.g., '?name=rick') */
    queryString?: string
}

/** Generates pagination URL for a given page number */
function getPageUrl(basePath: string, page: number, queryString?: string): string {
    return `${basePath}/${page}${queryString || ''}`
}

/**
 * Pagination component with page numbers and prev/next navigation.
 * Supports direct URL linking to specific pages.
 */
export function Pagination({ info, currentPage, basePath, queryString }: PaginationProps) {
    const totalPages = info.pages ?? 1
    const hasPrev = currentPage > 1
    const hasNext = currentPage < totalPages

    const getPageNumbers = (): (number | 'ellipsis')[] => {
        const pages: (number | 'ellipsis')[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
            return pages
        }

        pages.push(1)

        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)

        if (start > 2) {
            pages.push('ellipsis')
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        if (end < totalPages - 1) {
            pages.push('ellipsis')
        }

        pages.push(totalPages)

        return pages
    }

    const pageNumbers = getPageNumbers()

    return (
        <nav
            className="flex items-center justify-center gap-1"
            aria-label="Pagination"
        >
            <Button
                variant="outline"
                size="icon"
                asChild={hasPrev}
                disabled={!hasPrev}
                aria-label="Go to previous page"
            >
                {hasPrev ? (
                    <Link href={getPageUrl(basePath, currentPage - 1, queryString)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <span>
                        <ChevronLeft className="h-4 w-4" />
                    </span>
                )}
            </Button>

            <div className="hidden items-center gap-1 sm:flex">
                {pageNumbers.map((page, index) =>
                    page === 'ellipsis' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-muted-foreground"
                            aria-hidden="true"
                        >
                            ...
                        </span>
                    ) : (
                        <Button
                            key={page}
                            variant={page === currentPage ? 'default' : 'outline'}
                            size="icon"
                            asChild={page !== currentPage}
                            aria-label={`Go to page ${page}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                        >
                            {page === currentPage ? (
                                <span>{page}</span>
                            ) : (
                                <Link href={getPageUrl(basePath, page, queryString)}>
                                    {page}
                                </Link>
                            )}
                        </Button>
                    )
                )}
            </div>

            <span className="px-4 text-sm text-muted-foreground sm:hidden">
                Page {currentPage} of {totalPages}
            </span>

            <Button
                variant="outline"
                size="icon"
                asChild={hasNext}
                disabled={!hasNext}
                aria-label="Go to next page"
            >
                {hasNext ? (
                    <Link href={getPageUrl(basePath, currentPage + 1, queryString)}>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span>
                        <ChevronRight className="h-4 w-4" />
                    </span>
                )}
            </Button>
        </nav>
    )
}

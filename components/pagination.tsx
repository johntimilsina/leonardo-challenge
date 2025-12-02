'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Info } from '@/lib/graphql'

interface PaginationProps {
    info: Info
    currentPage: number
    basePath: string
}

export function Pagination({ info, currentPage, basePath }: PaginationProps) {
    const totalPages = info.pages ?? 1
    const hasPrev = info.prev !== null && info.prev !== undefined
    const hasNext = info.next !== null && info.next !== undefined

    const getPageNumbers = (): (number | 'ellipsis')[] => {
        const pages: (number | 'ellipsis')[] = []
        const showPages = 5 // Max pages to show
        const halfShow = Math.floor(showPages / 2)

        let start = Math.max(1, currentPage - halfShow)
        const end = Math.min(totalPages, start + showPages - 1)

        if (end - start < showPages - 1) {
            start = Math.max(1, end - showPages + 1)
        }

        if (start > 1) {
            pages.push(1)
            if (start > 2) pages.push('ellipsis')
        }

        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i)
            }
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('ellipsis')
            pages.push(totalPages)
        }

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
                    <Link href={`${basePath}?page=${currentPage - 1}`}>
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
                            variant={
                                page === currentPage ? 'default' : 'outline'
                            }
                            size="icon"
                            asChild={page !== currentPage}
                            aria-label={`Go to page ${page}`}
                            aria-current={
                                page === currentPage ? 'page' : undefined
                            }
                        >
                            {page === currentPage ? (
                                <span>{page}</span>
                            ) : (
                                <Link href={`${basePath}?page=${page}`}>
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
                    <Link href={`${basePath}?page=${currentPage + 1}`}>
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

import { Skeleton } from './skeleton'

export function PageSkeleton() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-14 border-b" />
            <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <Skeleton className="h-8 sm:h-9 w-48 sm:w-64" />
                    <Skeleton className="h-5 w-72 mt-2" />
                </div>
                <Skeleton className="h-5 w-40 mb-6" />
                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border overflow-hidden"
                        >
                            <Skeleton className="aspect-[4/3] w-full" />
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <div className="h-14 border-t" />
        </div>
    )
}

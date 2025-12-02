"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Header, CharacterGrid, CharacterModal } from "@/components";
import type { Character } from "@/lib/graphql";
import { Skeleton } from "@/components/ui/skeleton";

export default function InformationPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const searchParams = useSearchParams();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const pageParam = searchParams.get("page");
  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

  const handleSelectCharacter = useCallback((character: Character) => {
    setSelectedCharacter(character);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCharacter(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Characters</h1>
        <CharacterGrid page={page} onSelectCharacter={handleSelectCharacter} />
      </main>

      <CharacterModal
        character={selectedCharacter}
        onClose={handleCloseModal}
      />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-14 border-b" />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Skeleton className="h-9 w-48 mb-8" />
        <div className="space-y-8">
          <Skeleton className="h-5 w-48" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

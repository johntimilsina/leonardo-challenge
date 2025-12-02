/**
 * Home page component.
 * Redirects to the characters page where the main content resides.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold">Rick and Morty Explorer</h1>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </main>
  );
}

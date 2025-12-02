const CHALLENGE_VERSION = 'v3.5'

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto flex h-14 items-center justify-center px-4">
                <p className="text-sm text-muted-foreground">
                    Leonardo.Ai Challenge {CHALLENGE_VERSION}
                </p>
            </div>
        </footer>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Scroll to top button that appears when user scrolls down.
 * Fixed to bottom-right corner, especially useful on mobile.
 */
export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when scrolled down 300px
            setIsVisible(window.scrollY > 300)
        }

        window.addEventListener('scroll', toggleVisibility, { passive: true })
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    if (!isVisible) return null

    return (
        <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full shadow-lg bg-primary/90 hover:bg-primary backdrop-blur-sm transition-all duration-300 animate-in fade-in-0 zoom-in-95"
            aria-label="Scroll to top"
        >
            <ArrowUp className="h-5 w-5" />
        </Button>
    )
}

'use client'

import { useState, useCallback, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/contexts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

export default function WelcomePage() {
    const router = useRouter()
    const { isLoading, isAuthenticated, saveUser } = useUser()

    const [username, setUsername] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [errors, setErrors] = useState<{
        username?: string
        jobTitle?: string
    }>({})

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/information/1')
        }
    }, [isLoading, isAuthenticated, router])

    const validateForm = useCallback(() => {
        const newErrors: { username?: string; jobTitle?: string } = {}

        const trimmedUsername = username.trim()
        const trimmedJobTitle = jobTitle.trim()

        if (!trimmedUsername) {
            newErrors.username = 'Username is required'
        } else if (trimmedUsername.length < 2) {
            newErrors.username = 'Username must be at least 2 characters'
        }

        if (!trimmedJobTitle) {
            newErrors.jobTitle = 'Job title is required'
        } else if (trimmedJobTitle.length < 2) {
            newErrors.jobTitle = 'Job title must be at least 2 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [username, jobTitle])

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault()

            if (!validateForm()) return

            saveUser({
                username: username.trim(),
                jobTitle: jobTitle.trim(),
            })

            router.push('/information/1')
        },
        [username, jobTitle, validateForm, saveUser, router]
    )

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="text-4xl mb-2">🛸</div>
                    <CardTitle className="text-2xl">
                        Welcome to Rick and Morty Explorer
                    </CardTitle>
                    <CardDescription>
                        Enter your information to start exploring characters
                        from across the multiverse
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                aria-describedby={
                                    errors.username
                                        ? 'username-error'
                                        : undefined
                                }
                                aria-invalid={!!errors.username}
                                autoComplete="username"
                                autoFocus
                            />
                            {errors.username && (
                                <p
                                    id="username-error"
                                    className="text-sm text-destructive"
                                >
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jobTitle">Job Title</Label>
                            <Input
                                id="jobTitle"
                                type="text"
                                placeholder="Enter your job title"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                aria-describedby={
                                    errors.jobTitle
                                        ? 'jobtitle-error'
                                        : undefined
                                }
                                aria-invalid={!!errors.jobTitle}
                                autoComplete="organization-title"
                            />
                            {errors.jobTitle && (
                                <p
                                    id="jobtitle-error"
                                    className="text-sm text-destructive"
                                >
                                    {errors.jobTitle}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Start Exploring
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

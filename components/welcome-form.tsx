'use client'

import { useState, useCallback, FormEvent } from 'react'
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

interface FormErrors {
    username?: string
    jobTitle?: string
}

/**
 * Welcome form component for user onboarding.
 * Collects username and job title, validates input, and saves to context.
 */
export function WelcomeForm() {
    const router = useRouter()
    const { saveUser } = useUser()

    const [username, setUsername] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [errors, setErrors] = useState<FormErrors>({})

    const validateForm = useCallback(() => {
        const newErrors: FormErrors = {}

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

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
            <Card className="w-full max-w-md border-border/50 shadow-xl">
                <CardHeader className="text-center space-y-4 pb-2">
                    <div className="text-5xl">🛸</div>
                    <CardTitle className="text-2xl font-semibold">
                        Welcome to Rick and Morty Explorer
                    </CardTitle>
                    <CardDescription className="text-base">
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
                                    errors.username ? 'username-error' : undefined
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
                                    errors.jobTitle ? 'jobtitle-error' : undefined
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

                        <Button type="submit" className="w-full h-11 font-medium">
                            Start Exploring
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

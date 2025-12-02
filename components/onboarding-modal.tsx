'use client'

import { useState, useCallback, FormEvent } from 'react'
import { useUser } from '@/lib/contexts'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function OnboardingModal() {
    const { user, isLoading, isAuthenticated, saveUser } = useUser()

    const [username, setUsername] = useState(user?.username ?? '')
    const [jobTitle, setJobTitle] = useState(user?.jobTitle ?? '')
    const [errors, setErrors] = useState<{
        username?: string
        jobTitle?: string
    }>({})

    useState(() => {
        if (user) {
            setUsername(user.username)
            setJobTitle(user.jobTitle)
        }
    })

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
        },
        [username, jobTitle, validateForm, saveUser]
    )

    if (isLoading || isAuthenticated) {
        return null
    }

    return (
        <Dialog open={true}>
            <DialogContent
                className="sm:max-w-md"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                showCloseButton={false}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl">Welcome!</DialogTitle>
                    <DialogDescription>
                        Please enter your information to continue exploring Rick
                        and Morty characters.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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

                    <Button type="submit" className="w-full">
                        Continue
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

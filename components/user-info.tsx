'use client'

import { useState, useCallback, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { useUser } from '@/lib/contexts'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserInfo() {
    const router = useRouter()
    const { user, saveUser, clearUser } = useUser()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [username, setUsername] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [errors, setErrors] = useState<{
        username?: string
        jobTitle?: string
    }>({})

    const handleOpenEdit = useCallback(() => {
        if (user) {
            setUsername(user.username)
            setJobTitle(user.jobTitle)
            setErrors({})
        }
        setIsEditOpen(true)
    }, [user])

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
            setIsEditOpen(false)
        },
        [username, jobTitle, validateForm, saveUser]
    )

    const handleLogout = useCallback(() => {
        clearUser()
        router.replace('/welcome')
    }, [clearUser, router])

    if (!user) return null

    const initials = user.username.charAt(0).toUpperCase()

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        aria-label="User menu"
                    >
                        <Avatar className="h-9 w-9 cursor-pointer">
                            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">
                                {user.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {user.jobTitle}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleOpenEdit}>
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-destructive focus:text-destructive"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Update your username and job title.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-username">Username</Label>
                            <Input
                                id="edit-username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                aria-invalid={!!errors.username}
                            />
                            {errors.username && (
                                <p className="text-sm text-destructive">
                                    {errors.username}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-jobTitle">Job Title</Label>
                            <Input
                                id="edit-jobTitle"
                                type="text"
                                placeholder="Enter your job title"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                aria-invalid={!!errors.jobTitle}
                            />
                            {errors.jobTitle && (
                                <p className="text-sm text-destructive">
                                    {errors.jobTitle}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

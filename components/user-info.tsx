"use client";

import { useState, useCallback, FormEvent } from "react";
import { useUser } from "@/lib/contexts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Displays current user information with ability to edit.
 * Shows as a button that opens a dialog for editing.
 */
export function UserInfo() {
  const { user, saveUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(user?.username ?? "");
  const [jobTitle, setJobTitle] = useState(user?.jobTitle ?? "");
  const [errors, setErrors] = useState<{ username?: string; jobTitle?: string }>(
    {}
  );

  // Reset form when dialog opens
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && user) {
        setUsername(user.username);
        setJobTitle(user.jobTitle);
        setErrors({});
      }
      setIsOpen(open);
    },
    [user]
  );

  const validateForm = useCallback(() => {
    const newErrors: { username?: string; jobTitle?: string } = {};

    const trimmedUsername = username.trim();
    const trimmedJobTitle = jobTitle.trim();

    if (!trimmedUsername) {
      newErrors.username = "Username is required";
    } else if (trimmedUsername.length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    }

    if (!trimmedJobTitle) {
      newErrors.jobTitle = "Job title is required";
    } else if (trimmedJobTitle.length < 2) {
      newErrors.jobTitle = "Job title must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, jobTitle]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      saveUser({
        username: username.trim(),
        jobTitle: jobTitle.trim(),
      });
      setIsOpen(false);
    },
    [username, jobTitle, validateForm, saveUser]
  );

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="hidden sm:inline">
            {user.username} • {user.jobTitle}
          </span>
          <span className="sm:hidden">{user.username}</span>
        </Button>
      </DialogTrigger>

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
              aria-describedby={
                errors.username ? "edit-username-error" : undefined
              }
              aria-invalid={!!errors.username}
              autoComplete="username"
            />
            {errors.username && (
              <p id="edit-username-error" className="text-sm text-destructive">
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
              aria-describedby={
                errors.jobTitle ? "edit-jobtitle-error" : undefined
              }
              aria-invalid={!!errors.jobTitle}
              autoComplete="organization-title"
            />
            {errors.jobTitle && (
              <p id="edit-jobtitle-error" className="text-sm text-destructive">
                {errors.jobTitle}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

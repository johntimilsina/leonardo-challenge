/**
 * User information collected via onboarding modal.
 */
export interface User {
  username: string;
  jobTitle: string;
}

/**
 * LocalStorage key for persisting user data.
 */
export const USER_STORAGE_KEY = "leonardo_challenge_user";
